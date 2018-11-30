const styles = (theme) => ({
  eventOptionCollapse: {
    paddingTop: '1px',
    '&.first': {
      paddingTop: theme.padding.spaceX.px,
    },
    '&.last': {
      paddingBottom: theme.padding.spaceX.px,
    },
    '&.is_result span': {
      display: 'none !important',
    },
    '&.is_result.first': {
      paddingTop: 1,
    },
  },
  eventOptionWrapper: {
    width: '100%',
    display: 'block',
    position: 'relative',
    paddingLeft: theme.padding.space5X.px,
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
    paddingRight: '50px',
    marginTop: theme.padding.spaceX.px,
    marginBottom: theme.padding.spaceX.px,
  },
  eventOptionProgressNum: {
    width: '50px',
    lineHeight: 1,
    textAlign: 'right',
    position: 'absolute',
    right: 0,
    top: '-2px',
    fontWeight: theme.typography.fontWeightBold,
    color: theme.palette.text.primary,
  },
  eventOptionInput: {
    fontSize: theme.sizes.font.xLarge,
  },
});

export default styles;
