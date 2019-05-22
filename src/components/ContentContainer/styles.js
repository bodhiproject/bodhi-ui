export default (theme) => ({
  grid: {
    padding: theme.padding.space7X.px,
    overflowX: 'hidden',
    [theme.breakpoints.down('xs')]: {
      padding: theme.padding.space2X.px,
    },
  },
});
