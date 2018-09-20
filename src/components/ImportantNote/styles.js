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
    [theme.breakpoints.down('xs')]: {
      margin: 0,
      padding: `${theme.padding.unit.px} 0`,
      fontSize: 12,
    },
  },
});

export default styles;
