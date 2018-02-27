import antdEn from 'antd/lib/locale-provider/en_US';
import appLocaleData from 'react-intl/locale-data/en';
import enMessages from '../locales/en_US.json';

const EnLang = {
  messages: {
    'cornerclock.online': 'Online',
    'cornerclock.offline': 'Offline',
    'cornerclock.block': 'Current Block',
    'topbar.events': 'Events',
    'topbar.create': 'Create an Event',
    'dashboard.Bet': 'Bet',
    'dashboard.Set': 'Set',
    'dashboard.Vote': 'Vote',
    'dashboard.Finalize': 'Finalize',
    'dashboard.Withdraw': 'Withdraw',
    'dashboard.betend': 'Betting ends',
    'dashboard.resultsetend': 'Result setting ends',
    'dashboard.voteend': 'Voting ends',
    'dashboard.voteended': 'Voting ended',
    'sort.asc': 'Ascending',
    'sort.desc': 'Descending',
    'sort.default': 'Sort',
    'bottombutton.placebet': 'Place Bet',
    'bottombutton.setresult': 'Set Result',
    'bottombutton.vote': 'Place Vote',
    'bottombutton.final': 'Finalize Result',
    'bottombutton.withdraw': 'Withdraw',
    'create.title': 'Create an event',
    'create.name': 'Name',
    'create.betstartblock': 'BETTING START BLOCK',
    'create.betstartblockextra': 'The time when users can start betting.',
    'create.betstartblockmsg': 'Betting Start Time cannot be empty',
    'create.betendblock': 'Betting End Block',
    'create.betendblocksxtra': 'The time when users can no longer bet.',
    'create.betendblocksmsg': 'Betting End Time cannot be empty',
    'create.resultsetstartblock': 'Result Setting Start Block',
    'create.resultsetstartblockextra': 'The time when the Centralized Oracle can set the result.',
    'create.resultsetstartblockmsg': 'Result Setting Start Time cannot be empty',
    'create.resultsetendblock': 'Result Setting End Block',
    'create.resultsetendblockextra': 'The time when anyone can set the result.',
    'create.resultsetendblockmsg': 'Result Setting End Time cannot be empty',
    'create.results': 'RESULTS',
    'create.resultsmsg': 'Result name cannot be empty.',
    'create.resultsetter': 'Centralized Oracle',
    'create.resultsetterextra': 'This person will set the result.',
    'create.back': 'Back',
    'create.cancel': 'Cancel',
    'create.publish': 'Publish',
    'create.addresult': 'Add Result',
    'create.evtnotempty': 'Event name cannot be empty.',
    'create.nameplaceholder': 'e.g. Who will be the next president of the United States?',
    'create.COnotempty': 'Centralized Oracle cannot be empty.',
    'create.datetime': 'Select Date & Time',
    'create.resultindex': 'Result',
    'create.namelong': 'Event name is too long.',
    'create.validbetend': 'Must be greater than Betting Start Time',
    'create.validresultsetstart': 'Must be greater than or equal to Betting End Time',
    'create.validresultsetend': 'Must be greater than Result Setting Start Time',
    'create.resulttoolong': 'Result name is too long.',
    'create.alertsuc': 'The transaction is broadcasted to blockchain. \n You can view details from below link ',
    'create.alertfail': 'Oops, something went wrong',
    'cardinfo.topic': 'Topic Created',
    'cardinfo.betting': 'Betting',
    'cardinfo.orresultset': 'Oracle Result Setting',
    'cardinfo.opresultset': 'Open Result Setting',
    'cardinfo.vote': 'Voting',
    'cardinfo.final': 'Finalizing',
    'cardinfo.block': 'Block',
    'cardinfo.withdraw': 'Withdrawal',
    'cardinfo.setresult': 'Set Result',
    'cardinfo.confirm': 'Confirm',
    'cardinfo.finalize': 'Finalize',
    'cardinfo.blocks': 'Blocks',
    'cardinfo.sep': 'to',
    'cardinfo.any': 'anytime',
    'cardinfo.bet': 'Bet',
    'topbar.event': 'Event',
    'topbar.betting': 'Betting',
    'topbar.setting': 'Setting',
    'topbar.voting': 'Voting',
    'topbar.finalize': 'Finalizing',
    'topbar.completed': 'Completed',
    'oracle.resultsetter': 'Result setter',
    'oracle.consensus': 'Consensus Threshold {value}. This value indicates the amount of BOT needed to set the result.',
    'oracle.resultsetnote': `BOT tokens are needed for result setting. Don't leave this screen upon clicking Confirm. 
    Your BOT needs to be approved before result setting. The approved amount will automatically be used to 
    set the result after approval.`,
    'oracle.pass': 'Current block time has passed the Result Setting End Time.',
    'oracle.notcen': 'You are not the Centralized Oracle for this Topic and cannot set the result.',
    'oracle.openres': 'The Centralized Oracle has not set the result yet, but you may set the result by staking BOT.',
    'oracle.voting-1': 'Consensus Threshold {value}. This value indicates the amount of BOT needed to reach the Proof of Agreement and become the new result.',
    'oracle.votenote': `BOT tokens are needed for voting. Don't leave this screen upon clicking Confirm. Your BOT needs 
    to be approved before voting. The approved amount will automatically be used to vote afterwards.`,
    'oracle.passvote': `Current block time has passed the Voting End Time. 
    The previous result needs to be finalized in order to withdraw.`,
    'oracle.finalize': `Finalizing can be done by anyone. 
    Once finalized, winners can withdraw from the event in the Withdraw tab.`,
    'cardfinish.withdraw': 'You can withdraw',
    'str.raise': 'Raised',
    'str.RAISE': 'RAISED',
    'str.end': 'Ended',
    'str.outcome': 'OUTCOMES',
    'language.select': '中文',
    'predictinfo.enddate': 'ENDING DATE',
    'predictinfo.fund': 'FUNDING',
    'predictinfo.resultsetter': 'RESULT SETTER',
  },
  antd: antdEn,
  locale: 'en-US',
  data: appLocaleData,
};
export default EnLang;
