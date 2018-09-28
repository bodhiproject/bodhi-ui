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
    marginBottom: theme.padding.unit.px,
  },
  message: {
    textAlign: 'center',
    marginBottom: theme.padding.unit.px,
  },
});

export default styles;

