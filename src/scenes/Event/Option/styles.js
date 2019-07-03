const styles = (theme) => ({
  eventOptionCollapse: {
    paddingTop: '1px',
    '&.last': {
      paddingBottom: theme.padding.spaceX.px,
    },
    '&.is_result.first': {
      paddingTop: 1,
    },
  },
  eventOptionWrapper: {
    width: '100%',
    display: 'block',
    position: 'relative',
    paddingRight: '0 !important',
    marginTop: theme.padding.spaceX.px,
    marginBottom: theme.padding.spaceX.px,
    '&.noMargin': {
      margin: 0,
    },
    '&.last': {
      marginBottom: theme.padding.space2X.px,
    },
    [theme.breakpoints.up('sm')]: {
      paddingLeft: theme.padding.space3X.px,
    },
  },
  eventOptionNum: {
    background: theme.palette.background.grey,
    height: theme.sizes.icon.large,
    width: theme.sizes.icon.large,
    lineHeight: theme.sizes.icon.large,
    borderRadius: theme.sizes.icon.large,
    overflow: 'hidden',
    textAlign: 'center',
    fontSize: theme.sizes.font.xxSmall,
    fontWeight: theme.typography.fontWeightBold,
    color: theme.palette.text.primary,
    position: 'absolute',
    left: 0,
    top: 0,
  },
  eventOptionProgress: {
    position: 'relative',
    marginTop: theme.padding.spaceX.px,
    marginBottom: theme.padding.spaceX.px,
    height: '50px',
  },
  eventOptionProgressNum: {
    lineHeight: 1.5,
    textAlign: 'right',
    height: '100%',
    paddingRight: theme.padding.spaceX.px,
    color: '#fe0672',
    fontSize: '1.05rem',
    fontWeight: '400',
    fontFamily: 'Noto Sans TC, sans-serif',
    whiteSpace: 'nowrap',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  eventOptionInput: {
    fontSize: theme.sizes.font.xLarge,
    '& > input': {
      background: '#ffffff',
    },
  },
  overText: {
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    lineHeight: '1.5',
    paddingLeft: theme.padding.space2X.px,
    color: '#fe0672',
    fontSize: '1.05rem',
    fontWeight: '400',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  expansionPanelRoot: {
    boxShadow: 'none !important',
  },
  expansionPanelDisabled: {
    backgroundColor: 'transparent !important',
  },
  expansionPanelSummaryRoot: {
    padding: '0',
  },
  expansionPanelSummaryDisabled: {
    opacity: '1 !important',
  },
  expansionPanelSummaryContent: {
    margin: 0,
  },
  expandIcon: {
    top: '-5px',
    width: '38px',
    [theme.breakpoints.down('xs')]: {
      width: 'auto',
      padding: '0px 6px 0px',
    },
  },
  hideIcon: {
    visibility: 'hidden',
  },
  textWrapper: {
    width: '100%',
    height: 50,
    zIndex: 100,
    position: 'absolute',
    display: 'flex',
    justifyContent: 'space-between',
  },
  expansionPanelDetails: {
    [theme.breakpoints.down('xs')]: {
      padding: 0,
    },
  },
  expansionPanelSummaryExpanded: {
    [theme.breakpoints.down('xs')]: {
      marginTop: '0 !important',
    },
  },
});

export default styles;
