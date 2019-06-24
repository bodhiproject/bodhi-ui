const styles = (theme) => ({
  navBar: {
    boxShadow: 'none',
  },
  navBarShadow: {
    boxShadow: '0px 0px 4px 0px rgba(0,0,0,0.25)',
  },
  navBarWrapper: {
    display: 'flex',
    padding: `0 ${theme.padding.space3X.px}`,
    paddingRight: '0',
    alignItems: 'center',
    height: theme.sizes.navHeight.px,
    justifyContent: 'space-between',
    [theme.breakpoints.down('xs')]: {
      paddingLeft: theme.padding.spaceX.px,
    },
  },
  navSection: {
    display: 'flex',
    flexGrow: 1,
  },
  navBarLogo: {
    height: '38px',
    verticalAlign: 'middle',
  },
  navButton: {
    display: 'flex',
    flexDirection: 'row',
    fontSize: theme.sizes.font.xSmall,
    fontWeight: 400,
    color: 'rgba(255,255,255,0.65)',
    '&.selected': {
      color: 'white',
    },
    '&:hover': {
      color: 'white',
    },
    [theme.breakpoints.down('sm')]: {
      padding: `0 ${theme.padding.spaceX.px}`,
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: theme.sizes.font.xxSmall,
    },
  },
  rightButtonContainer: {
    height: theme.sizes.navHeight.px,
    lineHeight: theme.sizes.navHeight.px,
    color: theme.palette.background.paper,
    paddingLeft: theme.padding.spaceX.px,
    paddingRight: theme.padding.spaceX.px,
    display: 'flex',
    alignItems: 'center',
    textAlign: 'center',
    [theme.breakpoints.up('sm')]: {
      borderLeft: '1px solid rgba(0,0,0,0.2)',
    },
  },
  searchBarWrapper: {
    height: theme.sizes.navHeight.px,
    lineHeight: theme.sizes.navHeight.px,
    background: 'white',
    color: 'rgba(0, 0, 0, 1)',
  },
  myActivitiesWrapper: {
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.down('xs')]: {
      fontSize: theme.sizes.font.xxSmall,
      padding: `0 ${theme.padding.spaceX.px}`,
      right: 30,
    },
  },
  navBarMyActivitiesActionCount: {
    marginRight: 4,
  },
  myActivitiesButton: {
    height: 'auto',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    [theme.breakpoints.down('xs')]: {
      lineHeight: theme.sizes.font.xSmall.px,
    },
  },
  navDropdown: {
    minWidth: 275,
    background: theme.palette.background.paper,
    boxShadow: '0px -2px 20px -2px rgba(0,0,0,0.2), 0px -2px 5px rgba(0,0,0,0.1)',
    fontSize: theme.sizes.font.xSmall,
    position: 'absolute',
    right: 0,
    top: theme.sizes.navHeight.px,
    transition: '0.3s all ease-in-out',
    '&.hide': {
      display: 'none',
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: theme.sizes.font.xxSmall,
    },
  },
  navDropdownLinkItem: {
    color: theme.palette.text.primary,
    background: theme.palette.background.paper,
    display: 'flex',
    textAlign: 'left',
    padding: theme.padding.space3X.px,
    cursor: 'pointer',
    borderBottom: theme.border,
    justifyContent: 'space-between',
    '&:hover': {
      background: theme.palette.background.grey,
    },
    [theme.breakpoints.down('xs')]: {
      padding: theme.padding.space2X.px,
    },
  },
  navDropdownMyActivitiesContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  dropdownMyActivitiesCount: {
    marginLeft: 4,
  },
  audio: {
    visibility: 'hidden',
  },
});

export default styles;
