const styles = (theme) => ({
  predictionOptionWrapper: {
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
  predictionOptionNum: {
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
  predictionOptionIcon: {
    height: theme.sizes.icon,
    width: theme.sizes.icon,
    lineHeight: 1,
    fontSize: theme.sizes.icon,
    color: theme.palette.text.primary,
    position: 'absolute',
    left: 0,
    top: 0,
  },
  predictionOptionProgress: {
    position: 'relative',
    paddingRight: '50px',
    marginTop: theme.padding.unit.px,
    marginBottom: theme.padding.unit.px,
  },
  predictionOptionProgressNum: {
    width: '50px',
    lineHeight: 1,
    textAlign: 'right',
    position: 'absolute',
    right: 0,
    top: '-2px',
    fontWeight: theme.typography.fontWeightBold,
    color: theme.palette.text.primary,
  },
  predictionOptionInput: {
    fontSize: theme.sizes.font.titleMd,
  },
});

export default styles;
