import { PrismaClient } from '@prisma/client'
import { hashPassword } from '../server/utils/auth'

const prisma = new PrismaClient()

async function main() {
  console.log('开始初始化数据...')

  // 创建管理员用户
  const existingAdmin = await prisma.user.findUnique({
    where: { username: 'admin' }
  })

  const hashedPassword = await hashPassword('admin123')

  let admin
  if (!existingAdmin) {
    admin = await prisma.user.create({
      data: {
        username: 'admin',
        name: '超级管理员',
        password: hashedPassword,
        email: 'admin@example.com',
        role: 'superadmin',
        updatedAt: new Date()
      }
    })
    console.log('创建超级管理员用户:', admin)
  } else {
    // 更新现有用户为超管，密码为加密版本
    admin = await prisma.user.update({
      where: { id: existingAdmin.id },
      data: {
        password: hashedPassword,
        name: existingAdmin.name || '超级管理员',
        role: 'superadmin'
      }
    })
    console.log('更新管理员用户信息（升级为超管）')
  }

  // 创建网站设置
  const existingSettings = await prisma.sitesetting.findFirst()
  if (!existingSettings) {
    await prisma.sitesetting.create({
      data: {
        siteName: '带电清洗',
        siteSlogan: '专业工业清洗服务',
        updatedAt: new Date()
      }
    })
    console.log('创建网站设置完成')
  } else {
    console.log('网站设置已存在，跳过')
  }

  // 创建一些测试文章
  const existingArticles = await prisma.article.count()
  if (existingArticles === 0) {
    const testArticles = [
      {
        title: '带电清洗技术介绍',
        summary: '详细介绍带电清洗技术的原理和应用场景',
        content: '<h2>带电清洗技术</h2><p>带电清洗技术是一种先进的电力设备维护方法...</p>',
        category: 'tech',
        status: 'published',
        authorId: 1,
        updatedAt: new Date()
      },
      {
        title: '公司成功完成大型变电站清洗项目',
        summary: '近日，我公司成功完成某大型变电站的带电清洗项目',
        content: '<h2>项目完成</h2><p>我公司技术团队经过多日奋战，成功完成了...</p>',
        category: 'company',
        status: 'published',
        authorId: 1,
        updatedAt: new Date()
      },
      {
        title: '电力设备维护行业发展趋势',
        summary: '分析当前电力设备维护行业的发展趋势',
        content: '<h2>行业趋势</h2><p>随着电力行业的发展，带电清洗技术越来越受到重视...</p>',
        category: 'news',
        status: 'published',
        authorId: 1,
        updatedAt: new Date()
      }
    ]

    for (const article of testArticles) {
      await prisma.article.create({
        data: article
      })
    }
    console.log('创建测试文章完成')
  } else {
    console.log('文章数据已存在，跳过')
  }

  // 创建测试服务
  const existingServices = await prisma.service.count()
  if (existingServices === 0) {
    const testServices = [
      {
        title: '变电站带电清洗',
        description: '专业的变电站带电清洗服务，确保设备安全运行',
        content: '<h2>变电站带电清洗</h2><p>我们提供专业的变电站带电清洗服务...</p>',
        icon: '⚡',
        sortOrder: 1,
        authorId: 1,
        updatedAt: new Date()
      },
      {
        title: '工业设备清洗',
        description: '各类工业设备的专业清洗服务',
        content: '<h2>工业设备清洗</h2><p>我们为各类工业设备提供专业清洗服务...</p>',
        icon: '🔧',
        sortOrder: 2,
        authorId: 1,
        updatedAt: new Date()
      },
      {
        title: '高压清洗',
        description: '高压水射流清洗技术，高效清洁',
        content: '<h2>高压清洗</h2><p>我们采用先进的高压清洗技术...</p>',
        icon: '💧',
        sortOrder: 3,
        authorId: 1,
        updatedAt: new Date()
      }
    ]

    for (const service of testServices) {
      await prisma.service.create({
        data: service
      })
    }
    console.log('创建测试服务完成')
  } else {
    console.log('服务数据已存在，跳过')
  }

  // 创建测试案例
  const existingCases = await prisma.projectcase.count()
  if (existingCases === 0) {
    const testCases = [
      {
        title: '南方电网某变电站清洗项目',
        description: '成功完成南方电网某500kV变电站的带电清洗工程',
        content: '<h2>项目介绍</h2><p>项目位于广东省，是一项重要的变电站清洗工程...</p>',
        coverImage: '',
        location: '广东省',
        endDate: new Date('2024-01-15'),
        authorId: 1,
        status: 'published',
        updatedAt: new Date()
      },
      {
        title: '某石化企业设备清洗',
        description: '为某大型石化企业提供全套工业设备清洗服务',
        content: '<h2>项目介绍</h2><p>我们为该石化企业提供了全套设备清洗服务...</p>',
        coverImage: '',
        location: '江苏省',
        endDate: new Date('2024-02-20'),
        authorId: 1,
        status: 'published',
        updatedAt: new Date()
      }
    ]

    for (const testCase of testCases) {
      await prisma.projectcase.create({
        data: testCase
      })
    }
    console.log('创建测试案例完成')
  } else {
    console.log('案例数据已存在，跳过')
  }

  // 创建产品分类
  const existingCategories = await prisma.productcategory.count()
  if (existingCategories === 0) {
    const categories = [
      { name: '带电清洗设备', sortOrder: 1, updatedAt: new Date() },
      { name: '清洗药剂', sortOrder: 2, updatedAt: new Date() },
      { name: '检测仪器', sortOrder: 3, updatedAt: new Date() },
      { name: '安全防护', sortOrder: 4, updatedAt: new Date() },
    ]

    for (const cat of categories) {
      await prisma.productcategory.create({ data: cat })
    }
    console.log('创建产品分类完成')
  } else {
    console.log('产品分类已存在，跳过')
  }

  // 创建测试产品
  const existingProducts = await prisma.product.count()
  if (existingProducts === 0) {
    // 获取分类ID
    const categories = await prisma.productcategory.findMany()
    const catMap = new Map(categories.map(c => [c.name, c.id]))

    const testProducts = [
      {
        name: '高压带电清洗机 DX-3000',
        description: '适用于35kV及以下电压等级的带电清洗设备',
        content: '<h2>产品特点</h2><ul><li>高效安全</li><li>操作简便</li><li>适用范围广</li></ul>',
        price: 58000,
        categoryId: catMap.get('带电清洗设备') || 1,
        status: 'published',
        sortOrder: 1,
        updatedAt: new Date()
      },
      {
        name: '绝缘清洗剂 IC-200',
        description: '高效绝缘清洗剂，不损伤设备绝缘',
        content: '<h2>产品说明</h2><p>本产品采用进口原料，具有优异的绝缘性能...</p>',
        price: 280,
        categoryId: catMap.get('清洗药剂') || 2,
        status: 'published',
        sortOrder: 2,
        updatedAt: new Date()
      },
      {
        name: '红外热像仪 T-600',
        description: '高精度红外热像仪，用于设备温度检测',
        content: '<h2>技术参数</h2><ul><li>分辨率：640×480</li><li>测温范围：-20°C ~ 650°C</li></ul>',
        price: 45000,
        categoryId: catMap.get('检测仪器') || 3,
        status: 'published',
        sortOrder: 3,
        updatedAt: new Date()
      },
      {
        name: '绝缘手套 G-10kV',
        description: '10kV等级绝缘手套，符合国家标准',
        content: '<h2>安全等级</h2><p>适用于10kV及以下电压等级...</p>',
        price: 180,
        categoryId: catMap.get('安全防护') || 4,
        status: 'published',
        sortOrder: 4,
        updatedAt: new Date()
      },
      {
        name: '中压带电清洗机 DX-5000',
        description: '适用于110kV及以下电压等级的带电清洗设备',
        content: '<h2>产品特点</h2><ul><li>大功率清洗</li><li>智能控制</li><li>远程操作</li></ul>',
        price: 128000,
        categoryId: catMap.get('带电清洗设备') || 1,
        status: 'published',
        sortOrder: 5,
        updatedAt: new Date()
      },
      {
        name: '精密仪器清洗剂 PC-100',
        description: '用于精密仪器和电子设备的清洗',
        content: '<h2>适用范围</h2><p>适用于各类精密仪器、电路板等...</p>',
        price: 150,
        categoryId: catMap.get('清洗药剂') || 2,
        status: 'draft',
        sortOrder: 6,
        updatedAt: new Date()
      }
    ]

    for (const product of testProducts) {
      await prisma.product.create({ data: product })
    }
    console.log('创建测试产品完成')
  } else {
    console.log('产品数据已存在，跳过')
  }

  console.log('✅ 数据初始化完成！')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })