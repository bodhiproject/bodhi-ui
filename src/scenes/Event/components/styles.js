const styles = (theme) => ({
  title: {
    marginBottom: theme.padding.md.px,
  },
  oracleButton: {
    marginTop: theme.padding.md.px,
    background: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },
  oracleContent: {
    padding: theme.padding.lg.px,
    overflowX: 'hidden',
    [theme.breakpoints.down('xs')]: {
      padding: theme.padding.xs.px,
    },
  },
});

export default styles;
