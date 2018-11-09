const styles = (theme) => ({
  iconHeadingContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    margin: `${theme.padding.space2X.px} 0 ${theme.padding.spaceX.px} 0`,
  },
  iconButton: {
    width: theme.sizes.icon.large,
    height: theme.sizes.icon.large,
    backgroundColor: 'transparent',
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
  icon: {
    fontSize: theme.sizes.font.small.px,
    color: theme.palette.primary.main,
    marginRight: theme.padding.spaceX.px,
  },
  heading: {
    fontSize: theme.sizes.font.small.px,
    fontWeight: theme.typography.fontWeightBold,
    color: theme.palette.text.primary,
  },
  message: {
    fontSize: theme.sizes.font.xSmall.px,
    color: theme.palette.text.secondary,
    margin: `0 0 ${theme.padding.space2X.px} 0`,
    [theme.breakpoints.down('xs')]: {
      margin: 0,
      padding: `${theme.padding.spaceX.px} 0`,
      fontSize: 12,
    },
  },
});

export default styles;
