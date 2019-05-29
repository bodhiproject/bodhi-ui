const styles = (theme) => ({
  eventOptionCollapse: {
    paddingTop: '1px',
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
    // paddingLeft: theme.padding.space5X.px,
    paddingRight: '0 !important',
    marginTop: theme.padding.spaceX.px,
    marginBottom: theme.padding.spaceX.px,
    '&.noMargin': {
      margin: 0,
    },
    '&.last': {
      marginBottom: theme.padding.space2X.px,
    },
    '&:hover': {
      transform: 'scale(1.025)',
    },
  },
  overText: {
    position: 'absolute',
    textAlign: 'center',
    zIndex: 100,
    width: '50%',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    lineHeight: '3em',
    paddingLeft: theme.padding.spaceX.px,
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
    fontWeight: theme.typography.fontWeightBold,
    color: theme.palette.text.primary,
    height: '100%',
    paddingRight: theme.padding.spaceX.px,
  },
  eventOptionInput: {
    fontSize: theme.sizes.font.xLarge,
    height: '22px',
  },
  root: {
    height: '100%',
  },
});

export default styles;
