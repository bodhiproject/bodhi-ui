const styles = (theme) => ({
  headingContainer: {
    margin: `${theme.padding.unit.px} ${theme.padding.xs.px} 0px ${theme.padding.xs.px}`,
  },
  infoIcon: {
    fontSize: 18,
    color: theme.palette.primary.main,
    marginRight: theme.padding.unit.px,
  },
  headingText: {
    fontSize: theme.sizes.font.textMd,
    fontWeight: theme.typography.fontWeightBold,
    color: theme.palette.text.primary,
  },
  messageText: {
    fontSize: theme.sizes.font.textSm,
    color: theme.palette.text.secondary,
  },
});

export default styles;
