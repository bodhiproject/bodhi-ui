const styles = (theme) => ({
  errorRoute: {
    fontSize: theme.sizes.font.textSm,
    color: theme.palette.error.main,
    marginBottom: theme.padding.unit.px,
  },
  globalMessageError: {
    fontSize: theme.sizes.font.textSm,
    fontWeight: theme.typography.fontWeightBold,
    color: theme.palette.error.main,
  },
  globalMessageDefault: {
    fontSize: theme.sizes.font.textSm,
  },
});

export default styles;
