<template>
  <canvas ref="canvasRef" class="login-bg-canvas" />
</template>

<script setup lang="ts">
import * as THREE from 'three'

const canvasRef = ref<HTMLCanvasElement | null>(null)

// ── 配置 ──────────────────────────────────────
const SPARK_COUNT = 100       // 总粒子数
const FOLLOW_RATIO = 0.15     // 跟随鼠标的粒子比例
const ORB_COUNT = 8           // 柔和光球数
const LINE_COUNT = 12         // 飘动光线数
const MOUSE_BOLT_MAX = 5      // 鼠标闪电最大数量
const BOLT_LIFE = 0.6         // 闪电存活时间（秒）

const COLORS = {
  primary: [
    new THREE.Color('#93c5fd').multiplyScalar(0.8),
    new THREE.Color('#60a5fa').multiplyScalar(0.7),
    new THREE.Color('#3b82f6').multiplyScalar(0.6),
    new THREE.Color('#bfdbfe').multiplyScalar(0.9),
  ],
  soft: [
    new THREE.Color('#dbeafe').multiplyScalar(0.5),
    new THREE.Color('#eff6ff').multiplyScalar(0.4),
  ],
}

// ── 数据结构 ──────────────────────────────────────
interface Spark {
  x: number; y: number
  baseX: number; baseY: number
  vx: number; vy: number
  phase: number
  speed: number
  size: number
  opacity: number
  followMouse: boolean
  driftRadius: number
}

interface Orb {
  x: number; y: number
  baseX: number; baseY: number
  radius: number
  phase: number
  speed: number
  opacity: number
}

interface FlowLine {
  points: THREE.Vector3[]
  phase: number
  speed: number
  opacity: number
  width: number
}

interface MouseBolt {
  points: THREE.Vector3[]
  life: number
  maxLife: number
  width: number
  mesh: THREE.Mesh | null
  glowMesh: THREE.Mesh | null
}

let renderer: THREE.WebGLRenderer | null = null
let scene: THREE.Scene | null = null
let camera: THREE.PerspectiveCamera | null = null
let clock: THREE.Clock | null = null
let animationId = 0

// 粒子
let sparkMesh: THREE.Points | null = null
let sparkData: Spark[] = []

// 光球
let orbMeshes: THREE.Mesh[] = []
let orbData: Orb[] = []

// 飘动光线
let lineMeshes: THREE.Mesh[] = []
let lineData: FlowLine[] = []

// 鼠标闪电
let mouseBolts: MouseBolt[] = []
let lastMousePos = new THREE.Vector2(0, 0)
let mouseVelocity = 0

// 鼠标
let mouseNdc = new THREE.Vector2(10, 10)
let mouseSmooth = new THREE.Vector2(0, 0)

function init(canvas: HTMLCanvasElement) {
  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100)
  camera.position.z = 5

  renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance',
  })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setClearColor(0x000000, 0)

  // ── 初始化粒子 ────────────────────────────────
  initSparks()

  // ── 初始化光球 ────────────────────────────────
  initOrbs()

  // ── 初始化飘动光线 ────────────────────────────
  initFlowLines()

  clock = new THREE.Clock()
}

function initSparks() {
  const positions = new Float32Array(SPARK_COUNT * 3)
  const sizes = new Float32Array(SPARK_COUNT)
  const colors = new Float32Array(SPARK_COUNT * 3)

  for (let i = 0; i < SPARK_COUNT; i++) {
    const x = (Math.random() - 0.5) * 16
    const y = (Math.random() - 0.5) * 10
    const followMouse = i < SPARK_COUNT * FOLLOW_RATIO

    sparkData.push({
      x, y,
      baseX: x,
      baseY: y,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      phase: Math.random() * Math.PI * 2,
      speed: 0.2 + Math.random() * 0.5,
      size: 0.01 + Math.random() * 0.02,
      opacity: 0.3 + Math.random() * 0.5,
      followMouse,
      driftRadius: 0.5 + Math.random() * 1.5,
    })

    positions[i * 3] = x
    positions[i * 3 + 1] = y
    positions[i * 3 + 2] = 0
    sizes[i] = (0.01 + Math.random() * 0.02) * 100

    const color = COLORS.primary[Math.floor(Math.random() * COLORS.primary.length)]
    colors[i * 3] = color.r
    colors[i * 3 + 1] = color.g
    colors[i * 3 + 2] = color.b
  }

  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1))
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))

  const mat = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
    },
    vertexShader: `
      attribute float size;
      attribute vec3 color;
      varying vec3 vColor;
      varying float vAlpha;
      uniform float uTime;

      void main() {
        vColor = color;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = size * (150.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;

        // 柔和的呼吸效果
        float breath = sin(uTime * 0.8 + position.x * 2.0) * 0.2 + 0.8;
        vAlpha = breath;
      }
    `,
    fragmentShader: `
      varying vec3 vColor;
      varying float vAlpha;

      void main() {
        float dist = length(gl_PointCoord - vec2(0.5));
        if (dist > 0.5) discard;

        // 柔和的光晕
        float glow = 1.0 - smoothstep(0.0, 0.5, dist);
        glow = pow(glow, 1.5);

        gl_FragColor = vec4(vColor, glow * vAlpha * 0.6);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })

  sparkMesh = new THREE.Points(geo, mat)
  scene!.add(sparkMesh)
}

function initOrbs() {
  for (let i = 0; i < ORB_COUNT; i++) {
    const x = (Math.random() - 0.5) * 12
    const y = (Math.random() - 0.5) * 8
    const radius = 0.8 + Math.random() * 1.5

    orbData.push({
      x, y,
      baseX: x,
      baseY: y,
      radius,
      phase: Math.random() * Math.PI * 2,
      speed: 0.1 + Math.random() * 0.3,
      opacity: 0.03 + Math.random() * 0.05,
    })

    const geo = new THREE.CircleGeometry(radius, 32)
    const mat = new THREE.MeshBasicMaterial({
      color: COLORS.soft[Math.floor(Math.random() * COLORS.soft.length)],
      transparent: true,
      opacity: 0.04,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })

    const mesh = new THREE.Mesh(geo, mat)
    mesh.position.set(x, y, -1)
    scene!.add(mesh)
    orbMeshes.push(mesh)
  }
}

function spawnMouseBolt(x: number, y: number) {
  if (!scene || mouseBolts.length >= MOUSE_BOLT_MAX) return

  // 生成一个小闪电
  const angle = Math.random() * Math.PI * 2
  const length = 0.3 + Math.random() * 0.5
  const segments = 6 + Math.floor(Math.random() * 4)

  const points: THREE.Vector3[] = []
  for (let i = 0; i <= segments; i++) {
    const t = i / segments
    const px = x + Math.cos(angle) * length * t + (Math.random() - 0.5) * 0.1
    const py = y + Math.sin(angle) * length * t + (Math.random() - 0.5) * 0.1
    points.push(new THREE.Vector3(px, py, 0))
  }

  const width = 0.003 + Math.random() * 0.004
  const maxLife = BOLT_LIFE + Math.random() * 0.3

  // 创建主电弧
  const curve = new THREE.CatmullRomCurve3(points)
  const tubeGeo = new THREE.TubeGeometry(curve, segments * 2, width, 8, false)
  const tubeMat = new THREE.MeshBasicMaterial({
    color: new THREE.Color('#bfdbfe'),
    transparent: true,
    opacity: 0.8,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })
  const tubeMesh = new THREE.Mesh(tubeGeo, tubeMat)
  scene.add(tubeMesh)

  // 创建辉光
  const glowGeo = new THREE.TubeGeometry(curve, segments * 2, width * 3, 8, false)
  const glowMat = new THREE.MeshBasicMaterial({
    color: new THREE.Color('#3b82f6'),
    transparent: true,
    opacity: 0.3,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })
  const glowMesh = new THREE.Mesh(glowGeo, glowMat)
  scene.add(glowMesh)

  const bolt: MouseBolt = {
    points,
    life: 0,
    maxLife,
    width,
    mesh: tubeMesh,
    glowMesh,
  }

  mouseBolts.push(bolt)
}

function updateMouseBolts(delta: number, elapsed: number) {
  for (let i = mouseBolts.length - 1; i >= 0; i--) {
    const bolt = mouseBolts[i]
    bolt.life += delta

    if (bolt.life >= bolt.maxLife) {
      // 移除闪电
      if (bolt.mesh) {
        scene?.remove(bolt.mesh)
        bolt.mesh.geometry.dispose()
        ;(bolt.mesh.material as THREE.Material).dispose()
      }
      if (bolt.glowMesh) {
        scene?.remove(bolt.glowMesh)
        bolt.glowMesh.geometry.dispose()
        ;(bolt.glowMesh.material as THREE.Material).dispose()
      }
      mouseBolts.splice(i, 1)
      continue
    }

    // 更新透明度
    const lifeRatio = bolt.life / bolt.maxLife
    const fadeIn = Math.min(lifeRatio * 5, 1)
    const fadeOut = Math.max(1 - (lifeRatio - 0.5) / 0.5, 0)
    const flicker = Math.sin(elapsed * 20 + i * 3) * 0.2 + 0.8
    const opacity = fadeIn * fadeOut * flicker

    if (bolt.mesh) {
      ;(bolt.mesh.material as THREE.MeshBasicMaterial).opacity = opacity * 0.8
    }
    if (bolt.glowMesh) {
      ;(bolt.glowMesh.material as THREE.MeshBasicMaterial).opacity = opacity * 0.3
    }
  }
}

function initFlowLines() {
  for (let i = 0; i < LINE_COUNT; i++) {
    const points: THREE.Vector3[] = []
    const startX = (Math.random() - 0.5) * 14
    const startY = (Math.random() - 0.5) * 8
    const length = 2 + Math.random() * 4
    const angle = Math.random() * Math.PI * 2

    for (let j = 0; j <= 20; j++) {
      const t = j / 20
      const x = startX + Math.cos(angle) * length * t
      const y = startY + Math.sin(angle) * length * t + Math.sin(t * Math.PI * 2) * 0.3
      points.push(new THREE.Vector3(x, y, 0))
    }

    lineData.push({
      points,
      phase: Math.random() * Math.PI * 2,
      speed: 0.3 + Math.random() * 0.5,
      opacity: 0.1 + Math.random() * 0.2,
      width: 0.005 + Math.random() * 0.01,
    })

    // 创建曲线
    const curve = new THREE.CatmullRomCurve3(points)
    const tubeGeo = new THREE.TubeGeometry(curve, 40, lineData[i].width, 8, false)
    const tubeMat = new THREE.MeshBasicMaterial({
      color: COLORS.primary[Math.floor(Math.random() * COLORS.primary.length)],
      transparent: true,
      opacity: lineData[i].opacity,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })

    const mesh = new THREE.Mesh(tubeGeo, tubeMat)
    scene!.add(mesh)
    lineMeshes.push(mesh)
  }
}

function animate() {
  if (!scene || !camera || !renderer || !sparkMesh || !clock) return

  animationId = requestAnimationFrame(animate)
  const delta = clock.getDelta()
  const elapsed = clock.getElapsedTime()

  // 平滑鼠标
  mouseSmooth.x += (mouseNdc.x - mouseSmooth.x) * 2 * delta
  mouseSmooth.y += (mouseNdc.y - mouseSmooth.y) * 2 * delta
  const mouseWorldX = mouseSmooth.x * 8
  const mouseWorldY = mouseSmooth.y * 5

  // 检测鼠标速度，生成闪电
  const mouseDeltaX = mouseNdc.x - lastMousePos.x
  const mouseDeltaY = mouseNdc.y - lastMousePos.y
  const currentVelocity = Math.sqrt(mouseDeltaX * mouseDeltaX + mouseDeltaY * mouseDeltaY)
  mouseVelocity = mouseVelocity * 0.9 + currentVelocity * 0.1 // 平滑

  // 鼠标移动足够快时生成闪电
  if (mouseVelocity > 0.005 && Math.random() < 0.3) {
    spawnMouseBolt(mouseWorldX, mouseWorldY)
  }

  lastMousePos.copy(mouseNdc)

  // 更新鼠标闪电
  updateMouseBolts(delta, elapsed)

  // ── 更新粒子 ──────────────────────────────────
  const positions = (sparkMesh.geometry.attributes.position as THREE.BufferAttribute).array as Float32Array

  for (let i = 0; i < SPARK_COUNT; i++) {
    const s = sparkData[i]

    if (s.followMouse) {
      // 跟随鼠标的粒子（柔和吸引）
      const dx = mouseWorldX - s.x
      const dy = mouseWorldY - s.y
      const dist = Math.sqrt(dx * dx + dy * dy)

      if (dist > 0.3) {
        s.vx += (dx / dist) * 0.5 * delta
        s.vy += (dy / dist) * 0.5 * delta
      }

      // 限制速度
      const speed = Math.sqrt(s.vx * s.vx + s.vy * s.vy)
      if (speed > 1) {
        s.vx = (s.vx / speed) * 1
        s.vy = (s.vy / speed) * 1
      }
    } else {
      // 自由飘动的粒子
      const driftX = Math.sin(elapsed * s.speed + s.phase) * s.driftRadius
      const driftY = Math.cos(elapsed * s.speed * 0.7 + s.phase) * s.driftRadius * 0.6

      s.vx += (s.baseX + driftX - s.x) * 0.3 * delta
      s.vy += (s.baseY + driftY - s.y) * 0.3 * delta

      // 轻微阻尼
      s.vx *= 0.95
      s.vy *= 0.95
    }

    // 微小随机扰动
    s.vx += (Math.random() - 0.5) * 0.1 * delta
    s.vy += (Math.random() - 0.5) * 0.1 * delta

    s.x += s.vx
    s.y += s.vy

    positions[i * 3] = s.x
    positions[i * 3 + 1] = s.y
  }

  sparkMesh.geometry.attributes.position.needsUpdate = true
  ;(sparkMesh.material as THREE.ShaderMaterial).uniforms.uTime.value = elapsed

  // ── 更新光球 ──────────────────────────────────
  for (let i = 0; i < ORB_COUNT; i++) {
    const o = orbData[i]
    const mesh = orbMeshes[i]

    // 缓慢漂移
    const driftX = Math.sin(elapsed * o.speed + o.phase) * 1.5
    const driftY = Math.cos(elapsed * o.speed * 0.6 + o.phase) * 1

    o.x = o.baseX + driftX
    o.y = o.baseY + driftY

    mesh.position.set(o.x, o.y, -1)

    // 呼吸效果
    const breath = Math.sin(elapsed * 0.3 + o.phase) * 0.01 + o.opacity
    ;(mesh.material as THREE.MeshBasicMaterial).opacity = breath
  }

  // ── 更新飘动光线 ──────────────────────────────
  for (let i = 0; i < LINE_COUNT; i++) {
    const l = lineData[i]
    const mesh = lineMeshes[i]

    // 整体漂移
    const driftX = Math.sin(elapsed * l.speed + l.phase) * 0.5
    const driftY = Math.cos(elapsed * l.speed * 0.8 + l.phase) * 0.3

    mesh.position.set(driftX, driftY, 0)
    mesh.rotation.z = Math.sin(elapsed * l.speed * 0.5 + l.phase) * 0.1

    // 呼吸透明度
    const breath = Math.sin(elapsed * 0.5 + l.phase) * 0.05 + l.opacity
    ;(mesh.material as THREE.MeshBasicMaterial).opacity = breath
  }

  renderer.render(scene, camera)
}

function onResize() {
  if (!renderer || !camera) return
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}

function onMouseMove(e: MouseEvent) {
  mouseNdc.x = (e.clientX / window.innerWidth) * 2 - 1
  mouseNdc.y = -(e.clientY / window.innerHeight) * 2 + 1
}

function onVisibilityChange() {
  if (document.hidden) {
    cancelAnimationFrame(animationId)
    animationId = 0
  } else if (!animationId) {
    clock?.start()
    animate()
  }
}

onMounted(() => {
  if (!canvasRef.value) return
  init(canvasRef.value)
  animate()

  window.addEventListener('resize', onResize)
  window.addEventListener('mousemove', onMouseMove)
  document.addEventListener('visibilitychange', onVisibilityChange)
})

onUnmounted(() => {
  cancelAnimationFrame(animationId)
  window.removeEventListener('resize', onResize)
  window.removeEventListener('mousemove', onMouseMove)
  document.removeEventListener('visibilitychange', onVisibilityChange)

  // 清理鼠标闪电
  for (const bolt of mouseBolts) {
    if (bolt.mesh) {
      scene?.remove(bolt.mesh)
      bolt.mesh.geometry.dispose()
      ;(bolt.mesh.material as THREE.Material).dispose()
    }
    if (bolt.glowMesh) {
      scene?.remove(bolt.glowMesh)
      bolt.glowMesh.geometry.dispose()
      ;(bolt.glowMesh.material as THREE.Material).dispose()
    }
  }
  mouseBolts = []

  // 清理粒子
  sparkMesh?.geometry.dispose()
  ;(sparkMesh?.material as THREE.Material)?.dispose()

  // 清理光球
  for (const mesh of orbMeshes) {
    scene?.remove(mesh)
    mesh.geometry.dispose()
    ;(mesh.material as THREE.Material).dispose()
  }

  // 清理光线
  for (const mesh of lineMeshes) {
    scene?.remove(mesh)
    mesh.geometry.dispose()
    ;(mesh.material as THREE.Material).dispose()
  }

  renderer?.dispose()
  renderer = null
  scene = null
  camera = null
  clock = null
})
</script>

<style scoped>
.login-bg-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}
</style>
