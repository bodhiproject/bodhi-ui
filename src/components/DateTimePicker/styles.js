export default (theme) => ({
  pickerRoot: {
    [theme.breakpoints.down('sm')]: {
      padding: `${theme.padding.spaceX.px} 0px`,
    },
  },
  pickerInput: {
    [theme.breakpoints.down('sm')]: {
      fontSize: theme.sizes.font.xxSmall,
      height: theme.sizes.font.small,
    },
  },
  tabIcon: {
    width: theme.sizes.icon.large,
    height: theme.sizes.icon.large,
  },
});
