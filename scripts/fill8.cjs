const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const COVER = '/uploads/97131daa-298f-4f15-926e-b9daab4b78dc.png'

const I = (n, date, title, body, url) =>
  `<p><strong>${n}. ${title}</strong>（${date}）</p>\n<p>${body}</p>\n<p>来源：<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a></p>\n<p>&nbsp;</p>`

const weeks = [
  {
    title: '一周产业观察 | 储能行业动态汇总（2026 年 7 月 26 日 - 8 月 1 日）',
    publishedAt: '2026-08-01T12:00:00.000Z',
    items: [
      I(1, '7-31', 'CNESA 四届七次常务理事会在株洲召开', '联盟常务理事会在株洲召开，围绕储能标准、市场与安全等议题交流。', 'https://www.cnesa.org/activity/detail/?column_id=11&id=8378'),
      I(2, '7-19', '三部门明确 9 月起锂电池、钒液流征收消费税', '财政部、海关总署、税务总局公告，9 月 1 日起部分电池征税，钠电、固态等免税。', 'https://www.cnesa.org/information/detail/?column_id=3&id=8311'),
      I(3, '7-19', '内蒙古绿电直连新政：储能用电不计能耗碳排放', '支持存量企业电气化改造，减排量可用于指标置换。', 'https://www.cnesa.org/information/detail/?column_id=3&id=8314'),
      I(4, '7-20', '6 月新型储能新增装机 4.37GW/11.54GWh', '山东功率第一、西藏能量第一，月度装机创新高。', 'https://www.cnesa.org/information/detail/?column_id=58&id=8319'),
      I(5, '7-20', '上半年台区储能备案 52.5GWh', '1–6 月新增台区储能备案 814 个，约 25.9GW/52.5GWh。', 'https://www.cnesa.org/information/detail/?column_id=69&id=8304'),
      I(6, '7-09', '阳光电源发布 EnerNeo 固态变压器', '面向 AIDC 的固态变压器亮相，SST 赛道升温。', 'https://www.cnesa.org/information/detail/?column_id=58&id=8297'),
      I(7, '8-07', '7 月储能招标规模回落，2h 系统价格上涨', '系统招标约 5.6GW/18.0GWh，中标约 5.8GW/16.1GWh。', 'https://www.cnesa.org/information/detail/?column_id=58&id=8390'),
      I(8, '8-14', '储能百家讲堂 100 期：2026 储能政策半年观察', '梳理上半年容量电价、电力市场等政策。', 'https://www.cnesa.org/activity/detail/?column_id=11&id=8409'),
    ].join('\n'),
  },
  {
    title: '一周产业观察 | 储能行业动态汇总（2026 年 8 月 2 - 8 日）',
    publishedAt: '2026-08-08T12:00:00.000Z',
    items: [
      I(1, '8-07', '集采退潮：7 月储能招标回落', 'CNESA 发布 7 月招中标速览，2h 系统价格继续上涨。', 'https://www.cnesa.org/information/detail/?column_id=58&id=8390'),
      I(2, '8-14', '7 月新型储能并网 15.77GWh', '单月新增 4.90GW/15.77GWh，平均储能时长约 3.22h。', 'https://www.cnesa.org/information/detail/?column_id=58&id=8431'),
      I(3, '8-14', '百家讲堂 100 期政策半年观察', 'CNESA 活动，回顾上半年储能政策。', 'https://www.cnesa.org/activity/detail/?column_id=11&id=8409'),
      I(4, '8-17', '第十一届储能西部论坛日程发布', '论坛在兰州举办，聚焦新型储能。', 'https://www.cnesa.org/activity/detail/?column_id=11&id=8449'),
      I(5, '8-17', '特斯拉储能系统运输中坠落起火', '美国阿肯色州运输事故引发储能安全关注。', 'https://www.cnesa.org/information/detail/?column_id=58&id=8491'),
      I(6, '8-21', '固态电池全球首个国际标准立项', 'IEC 立项由中国提出，固态电池标准破冰。', 'https://www.cnesa.org/information/detail/?column_id=58&id=8479'),
      I(7, '8-21', '英伟达战略入股电力开发商', '算力与电力基础设施绑定加深。', 'https://www.cnesa.org/information/detail/?column_id=58&id=8482'),
      I(8, '8-24', '巴西-中国国际光伏与储能论坛举行', '聚焦光储出海与拉美合作。', 'https://www.cnesa.org/activity/detail/?column_id=11&id=8395'),
    ].join('\n'),
  },
  {
    title: '一周产业观察 | 储能行业动态汇总（2026 年 8 月 9 - 15 日）',
    publishedAt: '2026-08-15T12:00:00.000Z',
    items: [
      I(1, '8-14', '15.77GWh！7 月储能项目集中并网', 'GWh 级长时项目落地，7 月装机创年内新高。', 'https://www.cnesa.org/information/detail/?column_id=58&id=8431'),
      I(2, '8-14', '百家讲堂 100 期：储能政策半年观察', '政策端半年回顾。', 'https://www.cnesa.org/activity/detail/?column_id=11&id=8409'),
      I(3, '8-17', '特斯拉储能系统运输坠落起火', '运输环节安全事件。', 'https://www.cnesa.org/information/detail/?column_id=58&id=8491'),
      I(4, '8-17', '储能西部论坛日程发布', '兰州论坛议程公开。', 'https://www.cnesa.org/activity/detail/?column_id=11&id=8449'),
      I(5, '8-21', '固态电池国际标准立项', 'IEC 首个固态电池应用指南类标准。', 'https://www.cnesa.org/information/detail/?column_id=58&id=8479'),
      I(6, '8-21', '英伟达战略入股电力开发商', 'AIDC 电力需求外溢。', 'https://www.cnesa.org/information/detail/?column_id=58&id=8482'),
      I(7, '8-24', '巴西-中国国际光伏与储能论坛', '圣保罗召开。', 'https://www.cnesa.org/activity/detail/?column_id=11&id=8395'),
      I(8, '8-27', 'CNESA：上半年储能装机下降 18%', '西部论坛发布上半年数据。', 'https://www.cnesa.org/information/detail/?column_id=1&id=8509'),
    ].join('\n'),
  },
  {
    title: '一周产业观察 | 储能行业动态汇总（2026 年 8 月 16 - 22 日）',
    publishedAt: '2026-08-22T12:00:00.000Z',
    items: [
      I(1, '8-17', '特斯拉储能系统运输中坠落起火', '储运安全引关注。', 'https://www.cnesa.org/information/detail/?column_id=58&id=8491'),
      I(2, '8-17', '第十一届储能西部论坛日程发布', '行业重磅会议。', 'https://www.cnesa.org/activity/detail/?column_id=11&id=8449'),
      I(3, '8-21', '固态电池领域全球首个国际标准立项', 'IEC 立项。', 'https://www.cnesa.org/information/detail/?column_id=58&id=8479'),
      I(4, '8-21', '英伟达战略入股电力开发商', '算力电力协同。', 'https://www.cnesa.org/information/detail/?column_id=58&id=8482'),
      I(5, '8-24', '2026 巴西-中国国际光伏与储能论坛', '拉美市场交流。', 'https://www.cnesa.org/activity/detail/?column_id=11&id=8395'),
      I(6, '8-27', 'CNESA 发布上半年储能装机数据', '同比下降 18%。', 'https://www.cnesa.org/information/detail/?column_id=1&id=8509'),
      I(7, '8-28', '电池消费税征收范围国家税务总局答复', '电池簇征税口径明确。', 'https://www.cnesa.org/information/detail/?column_id=3&id=8524'),
      I(8, '8-31', '储能西部论坛专家洞见：下一个五年拼什么', '论坛观点汇总。', 'https://www.cnesa.org/information/detail/?column_id=58&id=8527'),
    ].join('\n'),
  },
  {
    title: '一周产业观察 | 储能行业动态汇总（2026 年 8 月 23 - 29 日）',
    publishedAt: '2026-08-29T12:00:00.000Z',
    items: [
      I(1, '8-27', 'CNESA：2026 上半年储能装机下降 18%', '第十一届储能西部论坛开幕式发布。', 'https://www.cnesa.org/information/detail/?column_id=1&id=8509'),
      I(2, '8-26', '第十一届储能西部论坛在兰州举办', '政产学研汇聚。', 'https://www.cnesa.org/activity/detail/?column_id=11&id=8449'),
      I(3, '8-28', '电池消费税口径明确', '税务总局答复电池簇征税。', 'https://www.cnesa.org/information/detail/?column_id=3&id=8524'),
      I(4, '8-29', '新能源场站配建储能高质量发展通知', '促进新能源与新型储能协同。', 'https://www.cnesa.org/information/detail/?column_id=3&id=8519'),
      I(5, '8-31', '论坛专家洞见：新型储能下一个五年', '技术、市场与商业模式讨论。', 'https://www.cnesa.org/information/detail/?column_id=58&id=8527'),
      I(6, '8-31', '阳光电源：AIDC 电源+配储能否再造增长', '上半年储能发货 25GWh。', 'https://www.cnesa.org/information/detail/?column_id=58&id=8528'),
      I(7, '9-01', '系统运行费近乎翻倍：9 月代理购电解读', '影响工商业与独立储能套利。', 'https://www.cnesa.org/information/detail/?column_id=58&id=8537'),
      I(8, '9-01', 'PPT：2026 上半年新型储能发展现状与趋势', '陈海生理事长主旨报告。', 'https://www.cnesa.org/information/detail/?column_id=58&id=8534'),
    ].join('\n'),
  },
  {
    title: '一周产业观察 | 储能行业动态汇总（2026 年 8 月 30 日 - 9 月 5 日）',
    publishedAt: '2026-09-05T12:00:00.000Z',
    items: [
      I(1, '9-01', '系统运行费近乎翻倍，投资需算清成本', '峰谷价差收窄与运行费上升并存。', 'https://www.cnesa.org/information/detail/?column_id=58&id=8537'),
      I(2, '9-01', '上半年产业发展现状及趋势 PPT', '西部论坛报告材料。', 'https://www.cnesa.org/information/detail/?column_id=58&id=8534'),
      I(3, '9-04', '户储企业盈利分化', '欧洲韧性与新兴市场崛起。', 'https://www.cnesa.org/information/detail/?column_id=58&id=8551'),
      I(4, '9-08', '钠电储能进入规模化爆发期', '规划产能与订单双升。', 'https://www.cnesa.org/information/detail/?column_id=2&id=8567'),
      I(5, '9-07', '山东分时电价新规', '工商业储能收益结构变化。', 'https://www.cnesa.org/policy/detail/?column_id=6&id=8595'),
      I(6, '9-10', '8 月储能系统中标 43GWh', '环比增长 167.6%。', 'https://www.cnesa.org/information/detail/?column_id=58&id=8576'),
      I(7, '9-11', '国家能源局首台（套）储能 10 项公示', '装备创新清单。', 'https://www.cnesa.org/policy/detail/?column_id=6&id=8583'),
      I(8, '9-09', '加拿大储能电站火灾', '疑似雨水渗入短路。', 'https://www.cnesa.org/information/detail/?column_id=2&id=8573'),
    ].join('\n'),
  },
  {
    title: '一周产业观察 | 储能行业动态汇总（2026 年 9 月 6 - 13 日）',
    publishedAt: '2026-09-13T12:00:00.000Z',
    items: [
      I(1, '9-07', '山东分时电价新规落地', '优化分时电价机制。', 'https://www.cnesa.org/policy/detail/?column_id=6&id=8595'),
      I(2, '9-10', '43GWh！8 月储能中标规模大增', '2h 系统均价连涨两个月。', 'https://www.cnesa.org/information/detail/?column_id=58&id=8576'),
      I(3, '9-11', '储能 10 项入选首台（套）清单公示', '国家能源局公示。', 'https://www.cnesa.org/policy/detail/?column_id=6&id=8583'),
      I(4, '9-08', '293.7GWh 规划产能+100GWh 订单：钠电爆发', '钠离子电池多场景渗透。', 'https://www.cnesa.org/information/detail/?column_id=2&id=8567'),
      I(5, '9-09', '加拿大 Summerside 储能电站火灾', '安全警示。', 'https://www.cnesa.org/information/detail/?column_id=2&id=8573'),
      I(6, '9-09', '储能公司半年报密集提及 AIDC', '锂电收入高增案例出现。', 'https://www.cnesa.org/information/detail/?column_id=2&id=8572'),
      I(7, '9-15', '意大利储能装机同比下滑 58%', '拍卖机制或成关键变量。', 'https://www.cnesa.org/information/detail/?column_id=2&id=8593'),
      I(8, '9-16', '贵州煤矿储能应急电源再奖补 744 万', '第二批奖补公示。', 'https://www.cnesa.org/information/detail/?column_id=2&id=8597'),
    ].join('\n'),
  },
  {
    title: '一周产业观察 | 储能行业动态汇总（2026 年 9 月 14 - 18 日）',
    publishedAt: '2026-09-18T12:00:00.000Z',
    items: [
      I(1, '9-17', '独立储能增长翻倍：8 月装机分析', '独立储能贡献近九成新增功率。', 'https://www.cnesa.org/information/detail/?column_id=58&id=8600'),
      I(2, '9-18', '河南检查独立储能开工，禁止圈而不建', '6–15 个月未投产项目纳入检查。', 'https://www.cnesa.org/information/detail/?column_id=69&id=8614'),
      I(3, '9-09', '河南 1192 号文落地细则', '源网荷储、虚拟电厂纳入监管。', 'https://www.cnesa.org/policy/detail/?column_id=6&id=8611'),
      I(4, '9-16', '河南分布式资源聚合交易试点', '分布式储能可参与售电。', 'https://www.cnesa.org/policy/detail/?column_id=6&id=8610'),
      I(5, '9-17', '河北征求风光储共用工程费用分摊意见', '费用分摊机制细化。', 'https://www.cnesa.org/policy/detail/?column_id=6&id=8601'),
      I(6, '9-19', '山西运城 200MW/800MWh 调频储能投运', '通过涉网试验转商运。', 'https://www.cnesa.org/information/detail/?column_id=69&id=8617'),
      I(7, '9-17', '华能 61MW/244MWh 熔盐储能投运', '向园区供汽。', 'https://www.cnesa.org/information/detail/?column_id=69&id=8612'),
      I(8, '9-17', '297MW/1188MWh 储能系统中标候选人公示', '围场独立储能示范项目。', 'https://www.cnesa.org/information/detail/?column_id=69&id=8603'),
      I(9, '9-18', 'Moss Landing 储能电站再度起火', '残留电池区域复燃。', 'https://www.cnesa.org/information/detail/?column_id=58&id=8609'),
      I(10, '9-20', '陕西独立储能推荐接入 7.57GW', '容量电价项目三年内不得转让。', 'https://www.cnesa.org/policy/detail/?column_id=6&id=8620'),
      I(11, '9-18', '亿纬锂能签约 Fluence 206GWh 供货', '2027–2031 框架协议。', 'https://www.cnesa.org/information/detail/?column_id=4&id=8606'),
      I(12, '9-18', '中国电建拟向奇点能源采购储能系统', '宁夏项目直接采购。', 'https://www.cnesa.org/information/detail/?column_id=4&id=8613'),
      I(13, '9-18', '卫蓝新能源签约匈牙利 150MWh 储能项目', '拓展欧洲市场。', 'https://www.cnesa.org/information/detail/?column_id=4&id=8616'),
      I(14, '9-18', '固德威 Megatron 电力交易智能体发布', '售电场景全自主交易验证。', 'https://www.cnesa.org/information/detail/?column_id=2&id=8605'),
    ].join('\n'),
  },
]

async function main() {
  for (const w of weeks) {
    const exist = await prisma.article.findFirst({ where: { title: w.title } })
    if (exist) {
      await prisma.article.update({
        where: { id: exist.id },
        data: {
          content: w.items,
          summary: '本周储能大事件（每条附 CNESA 来源链接，便于核验）',
          coverImage: COVER,
          updatedAt: new Date(),
        },
      })
      console.log('updated', exist.id, w.title.slice(0, 32), 'items', w.items.split('<p><strong>').length - 1)
      continue
    }
    const start = new Date(w.publishedAt)
    const old = await prisma.article.findFirst({
      where: {
        category: 'news',
        title: { contains: '产业' },
        publishedAt: { gte: new Date(start.getTime() - 36e5), lte: new Date(start.getTime() + 36e5) },
      },
    })
    if (old) {
      await prisma.article.update({
        where: { id: old.id },
        data: {
          title: w.title,
          content: w.items,
          summary: '本周储能大事件（每条附 CNESA 来源链接，便于核验）',
          coverImage: COVER,
          updatedAt: new Date(),
        },
      })
      console.log('replaced', old.id, w.title.slice(0, 32), 'items', w.items.split('<p><strong>').length - 1)
    } else {
      await prisma.article.create({
        data: {
          title: w.title,
          content: w.items,
          summary: '本周储能大事件（每条附 CNESA 来源链接，便于核验）',
          coverImage: COVER,
          authorId: 1,
          category: 'news',
          status: 'published',
          publishedAt: new Date(w.publishedAt),
          updatedAt: new Date(),
        },
      })
      console.log('created', w.title.slice(0, 32), 'items', w.items.split('<p><strong>').length - 1)
    }
  }
  await prisma.$disconnect()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
