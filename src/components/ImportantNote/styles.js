const styles = (theme) => ({
  iconHeadingContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    margin: `${theme.padding.xs.px} 0 ${theme.padding.unit.px} 0`,
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
    fontSize: theme.sizes.font.textMd,
    color: theme.palette.primary.main,
    marginRight: theme.padding.unit.px,
  },
  heading: {
    fontSize: theme.sizes.font.textMd,
    fontWeight: theme.typography.fontWeightBold,
    color: theme.palette.text.primary,
  },
  message: {
    fontSize: theme.sizes.font.textSm,
    color: theme.palette.text.secondary,
    margin: `0 0 ${theme.padding.xs.px} 0`,
    [theme.breakpoints.down('xs')]: {
      margin: 0,
      padding: `${theme.padding.unit.px} 0`,
      fontSize: 12,
    },
  },
});

export default styles;
