const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const COVER = '/uploads/97131daa-298f-4f15-926e-b9daab4b78dc.png'

function item(n, title, body, url) {
  return `<p><strong>${n}. ${title}</strong></p>\n<p>${body}</p>\n<p>来源：<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a></p>\n<p>&nbsp;</p>`
}

const weeks = [
  {
    title: '一周产业观察 | 储能行业动态汇总（2026 年 7 月 26 日 - 8 月 1 日）',
    publishedAt: '2026-08-01T12:00:00.000Z',
    content: [
      item(
        1,
        '中关村储能产业技术联盟第四届第七次常务理事会在株洲召开',
        '2026 年 7 月 31 日前后，CNESA 在株洲召开第四届第七次常务理事会，围绕储能产业标准、市场与安全等议题交流。',
        'https://www.cnesa.org/activity/detail/?column_id=11&id=8378'
      ),
      item(
        2,
        '台区储能备案上半年已达 52.5GWh 规模（背景参考）',
        'CNESA 统计显示，2026 年 1–6 月国内新增台区储能备案项目 814 个，规模合计约 25.9GW/52.5GWh，台区储能成为上半年热点方向。',
        'https://www.cnesa.org/information/detail/?column_id=69&id=8304'
      ),
      item(
        3,
        '固态变压器 SST 赛道升温（阳光电源发布 EnerNeo）',
        '2026 年 7 月 9 日，阳光电源发布面向 AIDC 的 EnerNeo 固态变压器，国内外算力与能源伙伴到场，SST 赛道关注度上升。',
        'https://www.cnesa.org/information/detail/?column_id=58&id=8297'
      ),
    ].join('\n'),
  },
  {
    title: '一周产业观察 | 储能行业动态汇总（2026 年 8 月 2 - 8 日）',
    publishedAt: '2026-08-08T12:00:00.000Z',
    content: [
      item(
        1,
        '集采退潮：7 月储能招标规模回落，2h 系统价格继续上涨',
        'CNESA 数据显示，2026 年 7 月储能系统招标约 5.6GW/18.0GWh，环比回落；中标约 5.8GW/16.1GWh。2 小时储能系统价格继续上涨，EPC 市场同步波动。',
        'https://www.cnesa.org/information/detail/?column_id=58&id=8390'
      ),
    ].join('\n'),
  },
  {
    title: '一周产业观察 | 储能行业动态汇总（2026 年 8 月 9 - 15 日）',
    publishedAt: '2026-08-15T12:00:00.000Z',
    content: [
      item(
        1,
        '15.77GWh！7 月储能项目集中并网，GWh 级长时项目密集落地',
        '2026 年 7 月新型储能新增装机 4.90GW/15.77GWh，功率与能量同比大增，创今年月度新高；平均储能时长约 3.22 小时。',
        'https://www.cnesa.org/information/detail/?column_id=58&id=8431'
      ),
      item(
        2,
        '储能百家讲堂 100 期：2026 储能政策半年观察',
        'CNESA 百家讲堂第 100 期围绕 2026 上半年储能政策进行梳理，关注容量电价、电力市场与项目管理等方向。',
        'https://www.cnesa.org/activity/detail/?column_id=11&id=8409'
      ),
    ].join('\n'),
  },
  {
    title: '一周产业观察 | 储能行业动态汇总（2026 年 8 月 16 - 22 日）',
    publishedAt: '2026-08-22T12:00:00.000Z',
    content: [
      item(
        1,
        '第十一届储能西部论坛日程发布',
        '由中国能源研究会、兰州大学、中关村储能产业技术联盟等主办的第十一届储能西部论坛日程公开，论坛在甘肃兰州举办。',
        'https://www.cnesa.org/activity/detail/?column_id=11&id=8449'
      ),
      item(
        2,
        '2026 巴西-中国国际光伏与储能论坛在圣保罗举行',
        '2026 年 8 月，巴西-中国国际光伏与储能论坛在圣保罗举行，聚焦光储出海与拉美市场合作。',
        'https://www.cnesa.org/activity/detail/?column_id=11&id=8395'
      ),
    ].join('\n'),
  },
  {
    title: '一周产业观察 | 储能行业动态汇总（2026 年 8 月 23 - 29 日）',
    publishedAt: '2026-08-29T12:00:00.000Z',
    content: [
      item(
        1,
        'CNESA：2026 上半年储能装机同比下降 18%，产业释放新信号',
        '8 月 27 日第十一届储能西部论坛开幕式上，CNESA 发布上半年储能装机数据与趋势判断，装机同比出现回落，产业结构调整信号明显。',
        'https://www.cnesa.org/information/detail/?column_id=1&id=8509'
      ),
      item(
        2,
        '第十一届储能西部论坛在兰州开幕',
        '论坛聚焦新型储能发展现状与趋势，同期发布相关产业研究材料。',
        'https://www.cnesa.org/activity/detail/?column_id=11&id=8449'
      ),
    ].join('\n'),
  },
  {
    title: '一周产业观察 | 储能行业动态汇总（2026 年 8 月 30 日 - 9 月 5 日）',
    publishedAt: '2026-09-05T12:00:00.000Z',
    content: [
      item(
        1,
        '系统运行费近乎翻倍，储能投资要算清成本：9 月电网代理购电解读',
        'CNESA 分析指出，9 月全国最大峰谷价差较 8 月收窄，前三季度系统运行费同比接近翻倍，将持续影响工商业储能与独立储能套利收益。',
        'https://www.cnesa.org/information/detail/?column_id=58&id=8537'
      ),
      item(
        2,
        '户储企业盈利分化：谁在领跑，谁在掉队？',
        '上市公司半年报显示，户用储能相关企业业绩分化；欧洲需求保持韧性，亚非拉等新兴市场增长较快。',
        'https://www.cnesa.org/information/detail/?column_id=58&id=8551'
      ),
      item(
        3,
        'PPT：2026 上半年新型储能产业发展现状及趋势',
        '陈海生理事长在储能西部论坛作主旨报告，梳理上半年产业发展现状与趋势。',
        'https://www.cnesa.org/information/detail/?column_id=58&id=8534'
      ),
    ].join('\n'),
  },
  {
    title: '一周产业观察 | 储能行业动态汇总（2026 年 9 月 6 - 13 日）',
    publishedAt: '2026-09-13T12:00:00.000Z',
    content: [
      item(
        1,
        '山东分时电价新规落地，工商业储能收益结构生变',
        '9 月 7 日，山东多部门联合发布进一步优化分时电价机制相关文件，对峰谷时段与价差、进而对工商业储能收益产生重要影响。',
        'https://www.cnesa.org/policy/detail/?column_id=6&id=8595'
      ),
      item(
        2,
        '43GWh！8 月储能系统中标规模环比增长 167.6%',
        '8 月储能系统中标约 3.1GW/43.0GWh，能量规模环比大增；2 小时系统均价连续两个月上涨。',
        'https://www.cnesa.org/information/detail/?column_id=58&id=8576'
      ),
      item(
        3,
        '储能 10 项入选国家能源局第六批首台（套）清单公示',
        '9 月 11 日，国家能源局公示第六批能源领域首台（套）重大技术装备清单，储能领域 10 个项目入选。',
        'https://www.cnesa.org/policy/detail/?column_id=6&id=8583'
      ),
    ].join('\n'),
  },
  {
    title: '一周产业观察 | 储能行业动态汇总（2026 年 9 月 14 - 18 日）',
    publishedAt: '2026-09-18T12:00:00.000Z',
    content: [
      item(
        1,
        '独立储能增长翻倍：8 月新型储能装机结构分析',
        '8 月国内新型储能装机环比回落但同比仍强，独立储能同比大幅增长，贡献当月近九成新增功率。',
        'https://www.cnesa.org/information/detail/?column_id=58&id=8600'
      ),
      item(
        2,
        '河南开展独立储能开工建设检查，禁止“圈而不建”',
        '河南省发改委印发通知，对出具接入书面答复 6–15 个月尚未投产的独立储能项目开展开工检查。',
        'https://www.cnesa.org/information/detail/?column_id=69&id=8614'
      ),
      item(
        3,
        '河南 1192 号文落地细则：源网荷储、虚拟电厂等纳入监管',
        '9 月 9 日，河南发布国家 1192 号文地方落地规定，明确适用范围与费用分摊等。',
        'https://www.cnesa.org/policy/detail/?column_id=6&id=8611'
      ),
      item(
        4,
        '河南开启分布式资源聚合交易试点：分布式储能可参与售电',
        '9 月 16 日，河南电力交易中心发布鹤壁淇县分布式资源聚合参与交易试运行方案。',
        'https://www.cnesa.org/policy/detail/?column_id=6&id=8610'
      ),
      item(
        5,
        '河北征求风电光伏独立储能共用工程费用分摊意见',
        '9 月 17 日，河北发布共用工程建设及费用分摊指导意见征求意见稿。',
        'https://www.cnesa.org/policy/detail/?column_id=6&id=8601'
      ),
      item(
        6,
        '200MW/800MWh 山西运城调频储能电站投运',
        '近日，山西运城调频储能电站通过涉网试验转入商用，配置液冷组串式储能 PCS。',
        'https://www.cnesa.org/information/detail/?column_id=69&id=8617'
      ),
      item(
        7,
        '华能 61MW/244MWh 熔盐储能系统投运',
        '9 月 17 日，华能北方公司增量配电网项目熔盐储能投运，首次向园区供汽。',
        'https://www.cnesa.org/information/detail/?column_id=69&id=8612'
      ),
      item(
        8,
        '297MW/1188MWh 储能系统中标候选人公示',
        '围场德御电网侧独立储能综合示范项目设备采购中标候选人公示。',
        'https://www.cnesa.org/information/detail/?column_id=69&id=8603'
      ),
      item(
        9,
        'Moss Landing 储能电站再度起火（安全警示）',
        '2026 年 9 月 18 日，美国加州 Moss Landing 储能电站再次发生火灾，涉 2025 年事故后残留电池区域。',
        'https://www.cnesa.org/information/detail/?column_id=58&id=8609'
      ),
      item(
        10,
        '陕西：独立储能推荐接入 7.57GW，享容量电价项目三年内不得转让',
        '9 月 20 日，陕西发布新型储能项目管理通知及推荐接入容量（757 万千瓦）。',
        'https://www.cnesa.org/policy/detail/?column_id=6&id=8620'
      ),
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
          content: w.content,
          summary: '本周储能政策、装机与项目动态（附来源链接）',
          coverImage: COVER,
          updatedAt: new Date(),
        },
      })
      console.log('updated', exist.id, w.title.slice(0, 28))
      continue
    }
    // 回填：按 publishedAt 找旧虚构稿并改写
    const start = new Date(w.publishedAt)
    const old = await prisma.article.findFirst({
      where: {
        category: 'news',
        title: { contains: '一周产业观察' },
        publishedAt: { gte: new Date(start.getTime() - 36e5), lte: new Date(start.getTime() + 36e5) },
      },
    })
    if (old) {
      await prisma.article.update({
        where: { id: old.id },
        data: {
          title: w.title,
          content: w.content,
          summary: '本周储能政策、装机与项目动态（附来源链接）',
          coverImage: COVER,
          updatedAt: new Date(),
        },
      })
      console.log('replaced', old.id, w.title.slice(0, 28))
    } else {
      await prisma.article.create({
        data: {
          title: w.title,
          content: w.content,
          summary: '本周储能政策、装机与项目动态（附来源链接）',
          coverImage: COVER,
          authorId: 1,
          category: 'news',
          status: 'published',
          publishedAt: new Date(w.publishedAt),
          updatedAt: new Date(),
        },
      })
      console.log('created', w.title.slice(0, 28))
    }
  }
  await prisma.$disconnect()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
