import antdZh from 'antd/lib/locale-provider/zh_TW';
import appLocaleData from 'react-intl/locale-data/zh';
import zhMessages from '../locales/zh-Hans.json';

const ZhLan = {
  messages: {
    'bottombar.online': '在线',
    'bottombar.offline': '离线',
    'bottombar.blockNum': '当前区块数',
    'bottombar.blockTime': '当前区块时间',
    'topbar.events': '事件',
    'topbar.create': '创建事件',
    'dashboard.Bet': '下注',
    'dashboard.Set': '设置',
    'dashboard.Vote': '投票',
    'dashboard.Finalize': '结束',
    'dashboard.Withdraw': '提现',
    'dashboard.betend': '投注结束于',
    'dashboard.resultsetend': '结果设置结束于',
    'dashboard.voteend': '投票结束于',
    'dashboard.voteended': '投票已结束',
    'sort.asc': '升序',
    'sort.desc': '降序',
    'sort.default': '排序',
    'bottombutton.placebet': '下注',
    'bottombutton.setresult': '设置结果',
    'bottombutton.vote': '投票',
    'bottombutton.final': '最终设定',
    'bottombutton.withdraw': '提现',
    'create.title': '创建事件',
    'create.name': '名称',
    'create.betstartblock': '投注开始区块数',
    'create.betstartblockextra': '用户投注开始时间',
    'create.betstartblockmsg': '投注开始时间不能为空',
    'create.betendblock': '投注结束区块数',
    'create.betendblocksxtra': '用户投注结束时间',
    'create.betendblocksmsg': '投注结束时间不能为空',
    'create.resultsetstartblock': '结果设置开始区块数',
    'create.resultsetstartblockextra': '中心化Oracle设置结果时间',
    'create.resultsetstartblockmsg': '结果设置起始时间不能为空',
    'create.resultsetendblock': '结果设置结束区块数',
    'create.resultsetendblockextra': '所有人都可设置结果的时间',
    'create.resultsetendblockmsg': '结果设置结束时间不能为空',
    'create.results': '结果',
    'create.resultsmsg': '结果名称不能为空',
    'create.resultsetter': '结果设置人',
    'create.resultsetterextra': '此人将会设置结果',
    'create.back': '返回',
    'create.cancel': '取消',
    'create.publish': '发布',
    'create.addresult': '添加结果',
    'create.evtnotempty': '事件名不能为空',
    'create.nameplaceholder': '例：谁会是下一任美国总统？',
    'create.COnotempty': '中心化Oracle不能为空',
    'create.datetime': '选择日期和时间',
    'create.resultindex': '结果',
    'create.namelong': '事件名称太长',
    'create.validbetend': '必须大于投注起始时间',
    'create.validresultsetstart': '必须大于或等于投注结束时间',
    'create.validresultsetend': '必须大于结果设置起始时间',
    'create.resulttoolong': '结果名称太长',
    'create.alertsuc': '这笔交易已经被广播到区块链. \n 你可以通过以下链接查看详细信息 ',
    'create.alertfail': '啊，有些东西错误',
    'cardinfo.topic': '项目创建',
    'cardinfo.betting': '下注',
    'cardinfo.orresultset': 'Oracle结果设定',
    'cardinfo.opresultset': '开放结果设定',
    'cardinfo.vote': '投票',
    'cardinfo.final': '结束',
    'cardinfo.block': '区块数',
    'cardinfo.withdraw': '取出',
    'cardinfo.setresult': '设置结果',
    'cardinfo.confirm': '确认',
    'cardinfo.finalize': '结束',
    'cardinfo.blocks': '区块数',
    'cardinfo.sep': '到',
    'cardinfo.any': '任意时间',
    'cardinfo.bet': '投注',
    'topbar.event': '事件',
    'topbar.betting': '投注',
    'topbar.setting': '设置',
    'topbar.voting': '投票',
    'topbar.finalize': '结束',
    'topbar.completed': '完成',
    'oracle.resultsetter': '结果设定者',
    'oracle.consensus': '共识阈值 {value}。这个值表示需要用于设置结果的BOT。',
    'oracle.resultsetnote': 'BOT用于结果设定。请不要离开此屏幕直到点击确定。 您的BOT在设置结果前需要被允许，被许可的数额将会自动用于设置结果。',
    'oracle.pass': '当前区块时间已经经过结果设定结束时间',
    'oracle.notcen': '您不是此话题的中心化Oracle，您不能设置结果',
    'oracle.openres': '中心化Oracle没有设置结果，但您可以使用BOT设置结果',
    'oracle.voting-1': '共识阈值 {value}。这个值表示需要达成共识和用于成为新结果所需的BOT.',
    'oracle.votenote': 'BOT用于投票。请不要离开此屏幕直到点击确定。 您的BOT在投票前需要被允许，被许可的数额将会自动用于投票。',
    'oracle.passvote': '当前区块时间已经经过结果投票结束时间，前一个结果需要被最终设定以便于提现。',
    'oracle.finalize': '任何人都可以结束。 一旦结束，赢家可以在提现标签页从对应事件提现。',
    'cardfinish.withdraw': '您可以提现',
    'str.raise': '筹集到',
    'str.RAISE': '筹集到',
    'str.end': '已结束',
    'str.outcome': '结果',
    'language.select': 'English',
    'predictinfo.enddate': '截止日期',
    'predictinfo.fund': '资金',
    'predictinfo.resultsetter': '结果设定者',
  },
  antd: antdZh,
  locale: 'zh-Hans-CN',
  data: appLocaleData,
};
export default ZhLan;
