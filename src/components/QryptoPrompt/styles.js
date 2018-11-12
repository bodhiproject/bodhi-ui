const styles = (theme) => ({
  inlineRoot: {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.padding.space7X.px,
  },
  popoverRoot: {
    maxWidth: 532,
    padding: theme.padding.space3X.px,
  },
  logo: {
    width: 48,
    marginBottom: theme.padding.space3X.px,
  },
  message: {
    fontSize: theme.sizes.font.medium,
    lineHeight: '32px',
    marginBottom: theme.padding.space3X.px,
    '&.left': {
      textAlign: 'left',
    },
    '&.center': {
      textAlign: 'center',
    },
    '&.marginLeft': {
      marginLeft: theme.padding.space2X.px,
    },
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  remindButton: {
    marginRight: theme.padding.space2X.px,
  },
});

export default styles;

