export default (theme) => ({
  grid: {
    padding: `0 ${theme.padding.space7X.px} ${theme.padding.space7X.px}`,
    [theme.breakpoints.down('xs')]: {
      padding: 0,
    },
  },
});
