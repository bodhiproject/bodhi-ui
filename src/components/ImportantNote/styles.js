const styles = (theme) => ({
  iconHeadingContainer: {
    width: 'fit-content',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    margin: `${theme.padding.space2X.px} 0 ${theme.padding.spaceX.px} 0`,
  },
  iconButton: {
    width: theme.sizes.icon.large,
    height: theme.sizes.icon.large,
    backgroundColor: 'transparent',
    padding: 0,
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
  icon: {
    fontSize: theme.sizes.font.small,
    color: theme.palette.primary.main,
    marginRight: theme.padding.spaceX.px,
  },
  heading: {
    fontSize: theme.sizes.font.small,
    fontWeight: theme.typography.fontWeightBold,
    color: theme.palette.text.primary,
    whiteSpace: 'pre-line',
  },
  message: {
    fontSize: theme.sizes.font.xSmall,
    color: theme.palette.text.secondary,
    margin: `0 0 ${theme.padding.space2X.px} 0`,
    [theme.breakpoints.down('xs')]: {
      margin: 0,
      padding: `${theme.padding.spaceX.px} 0`,
      fontSize: theme.sizes.font.xxSmall,
    },
  },
});

export default styles;
