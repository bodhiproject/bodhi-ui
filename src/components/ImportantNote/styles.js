const styles = (theme) => ({
  infoIcon: {
    fontSize: theme.sizes.font.textMd,
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
