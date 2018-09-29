const styles = (theme) => ({
  inlineRoot: {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.padding.lg.px,
  },
  popoverRoot: {
    maxWidth: 532,
    padding: theme.padding.sm.px,
  },
  logo: {
    width: 48,
    marginBottom: theme.padding.sm.px,
  },
  message: {
    fontSize: theme.sizes.font.textLg,
    lineHeight: '32px',
    marginBottom: theme.padding.sm.px,
    '&.left': {
      textAlign: 'left',
    },
    '&.center': {
      textAlign: 'center',
    },
    '&.marginLeft': {
      marginLeft: theme.padding.xs.px,
    },
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  remindButton: {
    marginRight: theme.padding.xs.px,
  },
});

export default styles;

