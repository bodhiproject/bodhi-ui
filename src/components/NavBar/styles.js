import { rgba } from 'polished';

const styles = (theme) => ({
  navBar: {
    boxShadow: 'none',
  },
  navBarShadow: {
    boxShadow: '0px 0px 4px 0px rgba(0,0,0,0.25)',
  },
  navBarWrapper: {
    display: 'flex',
    padding: `0 ${theme.padding.sm.px}`,
    paddingRight: '0',
    'align-items': 'center',
    height: '70px',
    'justify-content': 'space-between',
  },
  searchBarWrapper: {
    display: 'flex',
    padding: `0 ${theme.padding.sm.px}`,
    paddingRight: '0',
    'align-items': 'center',
    height: '70px',
    'justify-content': 'space-between',
    background: 'white',
    color: rgba(0, 0, 0, 1),
    lineHeight: '70px',
    boxShadow: '0px 0px 4px 0px rgba(0,0,0,0.25)',
  },
  searchResultWrapper: {
    boxShadow: '0px 0px 4px 0px rgba(0,0,0,0.25) inset',
    background: 'white',
    color: rgba(0, 0, 0, 1),
    'align-items': 'flex-start',
    overflowY: 'scroll',
    height: '450px',
  },
  searchBarTextField: {
    padding: '12px 16px 12px 16px',
    borderLeft: '2px solid #9B9B9B',
    margin: '10px 0px 10px 0px',
    height: '48px',
    width: '100%',
  },
  searchBarInput: {
    fontSize: theme.sizes.font.textLg,
  },
  SearchBarLeftIcon: {
    fontSize: theme.sizes.font.textLg,
    color: '#585AFA',
    paddingRight: 24,
  },
  navSection: {
    display: 'flex',
    flexGrow: 1,
  },
  navBarLogo: {
    height: '38px',
    verticalAlign: 'middle',
  },
  navBarWalletIcon: {
    marginRight: theme.padding.unit.px,
    verticalAlign: 'middle',
  },
  marginRightButton: {
    color: 'white',
    fontWeight: 400,
    marginRight: theme.padding.sm.px,
  },
  sides: {
    marginRight: theme.padding.unit.px,
    marginLeft: '32px',
  },
  dark: {
    color: 'white !important',
    fontWeight: 400,
    background: theme.palette.primary.dark,
  },
  navEventsButton: {
    color: 'rgba(255,255,255,0.65)',
    fontWeight: 400,
    '&.selected': {
      color: 'white',
    },
    '&:hover': {
      color: 'white',
    },
  },
  faq: {
    marginLeft: 10,
    color: 'white',
  },
  questionIcon: {
    marginRight: 2,
    '&:before': {
      fontSize: theme.sizes.icon,
    },
  },
  selectMenu: {
    color: 'white',
    paddingTop: 3,
    marginLeft: 25,
  },
});

export default styles;
