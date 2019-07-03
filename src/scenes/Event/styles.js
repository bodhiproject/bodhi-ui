export default (theme) => ({
  title: {
    marginBottom: theme.padding.space5X.px,
    fontSize: theme.sizes.font.large,
    wordWrap: 'break-word',
    [theme.breakpoints.down('xs')]: {
      marginBottom: theme.padding.space2X.px,
    },
  },
  actionButton: {
    marginTop: theme.padding.space5X.px,
    background: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    [theme.breakpoints.down('xs')]: {
      marginTop: theme.padding.space2X.px,
    },
  },
  withdrawingPaper: {
    padding: `${theme.padding.space5X.px} ${theme.padding.space5X.px} 0 ${theme.padding.space5X.px}`,
    [theme.breakpoints.down('md')]: {
      padding: theme.padding.space2X.px,
    },
    [theme.breakpoints.down('xs')]: {
      padding: 0,
    },
    boxShadow: 'none !important',
  },
  rewardTooltip: {
    background: '#FFFFFF',
    marginTop: '0px',
    marginBottom: '0px',
    paddingTop: '0px',
    paddingBottom: '0px',
  },
  rowDiv: {
    display: 'flex',
    flexDirection: 'row',
  },
  colDiv: {
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    marginBottom: theme.padding.spaceX.px,
    minWidth: '10%',
    margin: '0 auto',
  },
  tokenDiv: {
    fontSize: theme.sizes.font.xSmall,
    fontWeight: theme.typography.fontWeightBold,
  },
  pageRoot: {
    backgroundColor: 'transparent !important',
  },
  activeEvent: {
    backgroundColor: 'white',
    padding: '20px',
    boxShadow: '0 5px 20px rgba(0,0,0,.3) !important',
    borderRadius: '12px !important',
  },
  stateText: {
    textAlign: 'left',
    fontSize: '1rem',
    fontWeight: '800',
    marginBottom: '.5rem',
  },
  padLeft: {
    [theme.breakpoints.up('sm')]: {
      paddingLeft: theme.padding.space3X.px,
    },
  },
});
