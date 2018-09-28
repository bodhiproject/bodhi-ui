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
    padding: theme.padding.xs.px,
  },
  logo: {
    width: 48,
    marginBottom: theme.padding.sm.px,
  },
  message: {
    fontSize: theme.sizes.font.textLg,
    lineHeight: '32px',
    textAlign: 'center',
    marginBottom: theme.padding.md.px,
  },
});

export default styles;

