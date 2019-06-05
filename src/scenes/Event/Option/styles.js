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
    paddingLeft: theme.padding.space3X.px,
    paddingRight: '0 !important',
    marginTop: theme.padding.spaceX.px,
    marginBottom: theme.padding.spaceX.px,
    '&.noMargin': {
      margin: 0,
    },
    '&.last': {
      marginBottom: theme.padding.space2X.px,
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
  eventOptionIcon: {
    height: theme.sizes.icon.large,
    width: theme.sizes.icon.large,
    lineHeight: 1,
    fontSize: theme.sizes.icon.large,
    color: theme.palette.text.primary,
    position: 'absolute',
    left: 0,
    top: '-7px',
  },
  eventOptionProgress: {
    position: 'relative',
    marginTop: theme.padding.spaceX.px,
    marginBottom: theme.padding.spaceX.px,
    height: '50px',
  },
  eventOptionProgressNum: {
    width: '50%',
    lineHeight: 1.5,
    textAlign: 'right',
    position: 'absolute',
    right: 0,
    top: 0,
    height: '100%',
    paddingRight: theme.padding.spaceX.px,
    color: '#fe0672',
    fontSize: '1.05rem',
    fontWeight: '400',
    fontFamily: 'Noto Sans TC, sans-serif',
  },
  eventOptionInput: {
    fontSize: theme.sizes.font.xLarge,
  },
  overText: {
    position: 'absolute',
    zIndex: 100,
    width: '50%',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    lineHeight: '3em',
    paddingLeft: theme.padding.space2X.px,
    color: '#fe0672',
    fontSize: '1.05rem',
    fontWeight: '400',
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
  },
  hideIcon: {
    visibility: 'hidden',
  },
});

export default styles;
