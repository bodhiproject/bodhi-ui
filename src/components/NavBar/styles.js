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
    alignItems: 'center',
    height: theme.sizes.navHeight,
    justifyContent: 'space-between',
    [theme.breakpoints.down('xs')]: {
      paddingLeft: theme.padding.unit.px,
    },
  },
  searchBarWrapper: {
    height: theme.sizes.navHeight,
    lineHeight: theme.sizes.navHeight,
    background: 'white',
    color: 'rgba(0, 0, 0, 1)',
  },
  searchBarTextField: {
    width: '100%',
    margin: 'auto',
    verticalAlign: 'middle',
  },
  searchBarInputBase: {
    height: '48px',
    lineHeight: '48px',
    padding: `0px ${theme.padding.xs.px}`,
    borderLeft: `2px solid ${theme.palette.text.hint}`,
  },
  searchBarInput: {
    fontSize: theme.sizes.font.textLg,
    [theme.breakpoints.down('xs')]: {
      fontSize: 12,
    },
  },
  searchBarLeftIcon: {
    fontSize: theme.sizes.font.textLg,
    color: theme.palette.primary.main,
    paddingRight: theme.padding.sm.value,
  },
  searchButtonWrapper: {
    [theme.breakpoints.down('xs')]: {
      padding: `0 ${theme.padding.unit.px}`,
    },
  },
  searchBarFont: {
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
  navSection: {
    display: 'flex',
    flexGrow: 1,
  },
  navBarLogo: {
    height: '38px',
    verticalAlign: 'middle',
    [theme.breakpoints.down('xs')]: {
      width: 64,
    },
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
    [theme.breakpoints.down('xs')]: {
      fontSize: 12,
      padding: `0 ${theme.padding.unit.px}`,
    },
  },
  myActivitiesWrapper: {
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.down('xs')]: {
      fontSize: 12,
      padding: `0 ${theme.padding.unit.px}`,
      right: 30,
    },
  },
  myActivitiesBadgeBadge: {
    [theme.breakpoints.down('xs')]: {
      fontSize: 12,
      top: -5,
      width: 18,
      right: -9,
      height: 18,
    },
  },
  myActivitiesButton: {
    height: 'auto',
    [theme.breakpoints.down('xs')]: {
      lineHeight: theme.sizes.font.textSm,
    },
  },
  navToggle: {
    [theme.breakpoints.down('xs')]: {
      width: 30,
      fontSize: 12,
    },
  },
  navToggleIcon: {
    [theme.breakpoints.down('xs')]: {
      fontSize: 12,
    },
  },
  navDropdown: {
    [theme.breakpoints.down('xs')]: {
      fontSize: 12,
    },
  },
  navDropdownLinkItem: {
    [theme.breakpoints.down('xs')]: {
      padding: theme.padding.xs.px,
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
