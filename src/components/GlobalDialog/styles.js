const styles = (theme) => ({
  titleContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleIcon: {
    fontSize: theme.sizes.font.textLg,
    marginRight: theme.padding.unit.px,
  },
  heading: {
    fontSize: theme.sizes.font.textSm,
    fontWeight: theme.typography.fontWeightBold,
    color: theme.palette.error.main,
    marginBottom: theme.padding.unit.px,
  },
  body: {
    fontSize: theme.sizes.font.textSm,
    color: theme.palette.error.main,
  },
});

export default styles;
