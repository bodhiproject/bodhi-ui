const styles = theme => ({
  root: {
    background: theme.palette.background.default,
  },
  container: {
    minHeight: '100vh',

    [theme.breakpoints.up('xs')]: {
      margin: theme.padding.sm.px,
    },

    [theme.breakpoints.up('sm')]: {
      margin: theme.padding.md.px,
    },

    [theme.breakpoints.up('md')]: {
      margin: '0 auto',
      marginTop: theme.padding.md.px,
      marginBottom: theme.padding.md.px,
      maxWidth: (theme.breakpoints.values.md - (theme.padding.md.value * 2)),
    },

    [theme.breakpoints.up('lg')]: {
      maxWidth: (theme.breakpoints.values.lg - (theme.padding.md.value * 2)),
    },

    [theme.breakpoints.up('xl')]: {
      maxWidth: (theme.breakpoints.values.xl - (theme.padding.md.value * 2)),
    },
  },
});

export default styles;
