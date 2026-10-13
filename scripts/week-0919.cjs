const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const COVER = '/uploads/97131daa-298f-4f15-926e-b9daab4b78dc.png'

const I = (n, date, title, body, url) =>
  `<p><strong>${n}. ${title}</strong>（${date}）</p>\n<p>${body}</p>\n<p>来源：<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a></p>\n<p>&nbsp;</p>`

const title = '一周产业观察 | 储能行业动态汇总（2026 年 9 月 19 - 25 日）'
const content = [
  I(1, '9-24', '宁德时代签约罗马尼亚最大储能项目 918MWh', '与 Renovatio Solar 合作建设 Borzești 储能项目，为罗马尼亚同类最大规模之一。', 'https://www.cnesa.org/information/detail/?column_id=4&id=8632'),
  I(2, '9-24', '宁德时代「好电芯到好资产」储能投资人开放月', '宁德、厦门专场，围绕电芯品质与储能资产价值交流。', 'https://www.cnesa.org/information/detail/?column_id=4&id=8635'),
  I(3, '9-24', '协能科技发布膨胀力检测与 EIS 阻抗谱新品', '面向储能电站早期安全预警，关注热失控前置参数监测。', 'https://www.cnesa.org/information/detail/?column_id=4&id=8628'),
  I(4, '9-23', '东高未来能源发布智能构网型储能方案', '上海发布会推出大中型工商业与电站场景构网方案。', 'https://www.cnesa.org/information/detail/?column_id=4&id=8630'),
  I(5, '9-23', '双登 DP60 完成 AIDC 机房 UL9540A 火烧测试', '高倍率锂电室内备电场景大规模火烧测试一次通过。', 'https://www.cnesa.org/information/detail/?column_id=4&id=8629'),
  I(6, '9-23', '闻储创新完成亿元级融资，阿特斯控股', '家庭储能研发与全球市场扩张加速。', 'https://www.cnesa.org/information/detail/?column_id=4&id=8627'),
  I(7, '9-23', '安徽独立储能项目清单管理办法征求意见', '4 小时及以上、零碳园区内、中长期容量租赁占比高的项目优先。', 'https://www.cnesa.org/policy/detail/?column_id=6&id=8625'),
  I(8, '9-21', '五部门启动 2026 年度国家绿色算力设施推荐', '能源、互联网等领域按绿色算力评价指标推荐。', 'https://www.cnesa.org/policy/detail/?column_id=6&id=8631'),
  I(9, '9-22', '超 60 亿元钠电大单落地，22 家企业签约', '钠离子电池产业链与标准发展论坛（自贡）签约。', 'https://www.cnesa.org/information/detail/?column_id=4&id=8624'),
  I(10, '9-22', '首批钠离子电池针刺测试通过单位发布', '钠电安全评估与标准体系推进。', 'https://www.cnesa.org/information/detail/?column_id=4&id=8623'),
  I(11, '9-21', '宁德时代关联方战略投资世纪互联完成交割', '算力与能源资本协同加深。', 'https://www.cnesa.org/information/detail/?column_id=4&id=8621'),
  I(12, '9-20', '陕西：独立储能推荐接入 7.57GW', '享受容量电价项目建成后三年内不得转让。', 'https://www.cnesa.org/policy/detail/?column_id=6&id=8620'),
].join('\n')

async function main() {
  const exist = await prisma.article.findFirst({ where: { title } })
  if (exist) {
    await prisma.article.update({
      where: { id: exist.id },
      data: { content, summary: '本周储能政策、企业与项目动态（附 CNESA 来源链接）', coverImage: COVER, updatedAt: new Date() },
    })
    console.log('updated', exist.id)
  } else {
    await prisma.article.create({
      data: {
        title,
        content,
        summary: '本周储能政策、企业与项目动态（附 CNESA 来源链接）',
        coverImage: COVER,
        authorId: 1,
        category: 'news',
        status: 'published',
        publishedAt: new Date('2026-09-25T12:00:00.000Z'),
        updatedAt: new Date(),
      },
    })
    console.log('created', title)
  }
  await prisma.$disconnect()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
