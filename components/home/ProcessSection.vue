<template>
  <section id="process" class="process-section">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <header class="process-header">
        <span class="section-tag">服务流程</span>
        <h2 class="process-title">四步交付，过程可预期</h2>
        <p class="process-desc">全程安全监护 · 节点书面确认 · 交付资料齐全</p>
      </header>

      <ol class="process-track">
        <li v-for="(step, i) in steps" :key="step.title" class="process-card">
          <div class="process-card-top">
            <span class="process-badge">
              <span class="process-num">{{ String(i + 1).padStart(2, '0') }}</span>
              <span class="process-icon" v-html="step.icon" />
            </span>
            <span v-if="i < steps.length - 1" class="process-link" aria-hidden="true" />
          </div>

          <div class="process-card-body">
            <div class="process-card-title-row">
              <h3 class="process-step-title">{{ step.title }}</h3>
              <span class="process-timing">{{ step.timing }}</span>
            </div>
            <p class="process-step-desc">{{ step.desc }}</p>
            <ul class="process-points">
              <li v-for="p in step.points" :key="p">{{ p }}</li>
            </ul>
          </div>

          <div class="process-output">
            <span class="process-output-label">产出</span>
            <span class="process-output-value">{{ step.output }}</span>
          </div>
        </li>
      </ol>
    </div>
  </section>
</template>

<script setup lang="ts">
const steps = [
  {
    title: '需求沟通',
    timing: '当天',
    desc: '确认设备、电压等级与停电窗口，判断带电作业或储能改造是否合适。',
    points: ['30 分钟内电话 / 微信回复', '可先发照片或设备清单', '按清洗、储能或综合分流'],
    output: '需求确认要点',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
  },
  {
    title: '现场勘查',
    timing: '1–3 天',
    desc: '评估作业风险与现场条件，明确防护、接地和人员机具要求。',
    points: ['带电风险与窗口评估', '拍照记录并确认安全措施', '储能看容量、并网与机房'],
    output: '勘查纪要',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
  },
  {
    title: '方案报价',
    timing: '2–5 天',
    desc: '工艺、工期与配置可落地，安全与验收标准写进方案，报价透明。',
    points: ['工艺、工期、人员机具', '安全措施与验收标准', '支持按次或分期报价'],
    output: '技术方案 + 报价单',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M8 13h8M8 17h5"/></svg>',
  },
  {
    title: '施工交付',
    timing: '按约定',
    desc: '班前交底、过程监护，按规范施工验收，资料一次交清。',
    points: ['班前交底，全程有人监护', '清洗留过程记录 / 储能含调试', '验收报告与运维建议'],
    output: '验收资料包',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>',
  },
]
</script>

<style scoped>
.process-section {
  padding: 80px 0;
  background: #f8fafc;
  scroll-margin-top: 88px;
}

.process-header {
  text-align: center;
  margin-bottom: 40px;
}

.process-title {
  margin: 10px 0 10px;
  font-size: clamp(18px, 1.6vw, 24px);
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.02em;
  line-height: 1.25;
}

.process-desc {
  margin: 0;
  color: #64748b;
  font-size: 14px;
  line-height: 1.6;
  letter-spacing: 0.05em;
}

.process-track {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 18px;
  position: relative;
}

.process-card {
  position: relative;
  display: flex;
  flex-direction: column;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 0 0 16px;
  box-shadow: 0 4px 18px rgba(15, 23, 42, 0.04);
  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
  overflow: visible;
}

.process-card:hover {
  transform: translateY(-3px);
  border-color: #bfdbfe;
  box-shadow: 0 14px 32px rgba(37, 99, 235, 0.08);
}

.process-card-top {
  position: relative;
  display: flex;
  justify-content: center;
  padding-top: 20px;
  margin-bottom: 4px;
}

.process-badge {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: linear-gradient(145deg, #3b82f6, #2563eb);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 18px rgba(37, 99, 235, 0.28);
  position: relative;
  z-index: 1;
}

.process-num {
  font-family: ui-monospace, 'Cascadia Code', 'Source Code Pro', Menlo, Consolas, monospace;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.02em;
  line-height: 1;
}

.process-icon {
  display: none;
}

.process-link {
  position: absolute;
  top: 44px;
  left: calc(50% + 32px);
  width: calc(100% - 40px);
  height: 2px;
  background: linear-gradient(90deg, #93c5fd, #dbeafe);
  z-index: 0;
}

.process-card:last-child .process-link {
  display: none;
}

.process-card-body {
  padding: 12px 18px 8px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.process-card-title-row {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: 6px 10px;
  margin-bottom: 10px;
}

.process-step-title {
  margin: 0;
  font-size: 15.5px;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: 0.02em;
  line-height: 1.3;
}

.process-timing {
  font-size: 11px;
  font-weight: 700;
  color: #2563eb;
  background: #eff6ff;
  padding: 3px 8px;
  border-radius: 999px;
  line-height: 1.3;
  white-space: nowrap;
}

.process-step-desc {
  margin: 0 0 12px;
  font-size: 12.5px;
  color: #64748b;
  line-height: 1.7;
  text-wrap: pretty;
}

.process-points {
  list-style: none;
  margin: 0 0 16px;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 7px;
  flex: 1;
}

.process-points li {
  position: relative;
  padding-left: 13px;
  font-size: 12px;
  color: #334155;
  line-height: 1.55;
  text-wrap: pretty;
}

.process-points li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.55em;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #60a5fa;
}

.process-output {
  margin: 0 18px;
  display: flex;
  align-items: baseline;
  gap: 8px;
  padding: 10px 12px;
  border-radius: 10px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  line-height: 1.4;
}

.process-output-label {
  font-size: 11px;
  font-weight: 700;
  color: #94a3b8;
  letter-spacing: 0.08em;
  flex-shrink: 0;
}

.process-output-value {
  font-size: 12.5px;
  font-weight: 650;
  color: #0f172a;
}

/* md-desktop-density */
@media (min-width: 960px) and (max-width: 1440px) {
  .process-section {
    padding: 64px 0 72px;
  }

  .process-track {
    gap: 16px;
  }

  .process-title {
    font-size: 28px;
  }

  .process-card-body {
    padding: 12px 14px 8px;
  }

  .process-step-desc {
    font-size: 12.5px;
  }

  .process-points li {
    font-size: 12px;
  }

  .process-output {
    margin: 0 14px;
    padding: 9px 10px;
  }
}

@media (min-width: 960px) and (max-width: 1200px) {
  .process-track {
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }

  .process-link {
    display: none;
  }
}

@media (max-width: 1024px) {
  .process-track {
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }

  .process-link {
    display: none;
  }
}

@media (max-width: 560px) {
  .process-section {
    padding: 48px 0 56px;
  }

  .process-title {
    font-size: 22px;
  }

  .process-header {
    margin-bottom: 28px;
  }

  .process-track {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .process-card {
    border-radius: 14px;
  }

  .process-card-top {
    justify-content: flex-start;
    padding: 16px 16px 0;
  }

  .process-badge {
    width: 40px;
    height: 40px;
    border-radius: 12px;
  }

  .process-card-body {
    padding: 12px 16px 6px;
  }

  .process-output {
    margin: 0 16px;
  }

  .process-step-title {
    font-size: 16px;
  }
}
</style>
