const styles = theme => ({
  predictionDetailPaper: {
    boxShadow: 'none',
    borderRadius: theme.borderRadius,
  },
  predictionDetailContainerGrid: {
    padding: theme.padding.lg.px,
    '&.right': {
      borderLeft: theme.border,
      textAlign: 'right',
    },
  },
  predictionDetailTitle: {
    marginBottom: theme.padding.md.px,
  },
  predictionItemWrapper: {
    width: '100%',
    display: 'block',
    position: 'relative',
    paddingLeft: theme.padding.md.px,
    paddingRight: '0 !important',
    marginTop: theme.padding.unit.px,
    marginBottom: theme.padding.unit.px,
    '&.noMargin': {
      margin: 0,
    },
    '&.last': {
      marginBottom: theme.padding.xs.px,
    },
  },
  predictionItemNum: {
    background: theme.palette.background.grey,
    height: theme.sizes.icon,
    width: theme.sizes.icon,
    lineHeight: theme.sizes.icon,
    borderRadius: theme.sizes.icon,
    overflow: 'hidden',
    textAlign: 'center',
    fontSize: theme.sizes.font.meta,
    fontWeight: theme.typography.fontWeightBold,
    color: theme.palette.text.primary,
    position: 'absolute',
    left: 0,
    top: 0,
  },
  predictionItemIcon: {
    height: theme.sizes.icon,
    width: theme.sizes.icon,
    lineHeight: 1,
    fontSize: theme.sizes.icon,
    color: theme.palette.text.primary,
    position: 'absolute',
    left: 0,
    top: 0,
  },
  predictionItemProgress: {
    position: 'relative',
    paddingRight: '50px',
    marginTop: theme.padding.unit.px,
    marginBottom: theme.padding.unit.px,
  },
  predictionItemProgressNum: {
    width: '50px',
    lineHeight: 1,
    textAlign: 'right',
    position: 'absolute',
    right: 0,
    top: '-2px',
    fontWeight: theme.typography.fontWeightBold,
    color: theme.palette.text.primary,
  },
  predictionItemInput: {
    fontSize: theme.sizes.font.titleMd,
  },
  predictButton: {
    marginTop: theme.padding.md.px,
  },
  predictionDetailInfoWrapper: {
    marginBottom: '36px',
  },
  predictionDetailInfo: {
    marginTop: theme.padding.unit.px,
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    paddingLeft: theme.padding.lg.px,
  },
  predictionStepper: {
    position: 'relative',
    left: '100%',
    background: 'transparent',
    marginLeft: '-'.concat(theme.padding.md.px),
    marginTop: theme.padding.md.px,
  },
  predictionStepLabel: {
    '& > span:last-of-type': {
      position: 'relative',
      right: '100%',
      paddingRight: theme.padding.unit.px,
    },
    '& > span:last-of-type > span > span': {
      marginTop: '2px',
    },
  },
});

export default styles;
