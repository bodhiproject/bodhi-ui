export default (theme) => ({
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
  searchButtonIcon: {
    color: 'rgba(255,255,255,0.65)',
    '&.selected': {
      color: 'white',
    },
    '&:hover': {
      color: 'white',
    },
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
  searchBarFont: {
    paddingLeft: theme.padding.spaceX.px,
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
});
