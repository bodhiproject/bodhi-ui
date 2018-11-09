const styles = (theme) => ({
  titleContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleIcon: {
    fontSize: theme.sizes.font.medium.px,
    marginRight: theme.padding.spaceX.px,
  },
  heading: {
    fontSize: theme.sizes.font.xSmall.px,
    fontWeight: theme.typography.fontWeightBold,
    color: theme.palette.error.main,
    marginBottom: theme.padding.spaceX.px,
  },
  body: {
    fontSize: theme.sizes.font.xSmall.px,
    color: theme.palette.error.main,
  },
});

export default styles;
