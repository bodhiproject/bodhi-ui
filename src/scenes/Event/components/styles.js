const styles = (theme) => ({
  rootPaper: {
    // box-shadow: none !important; // TODO: fix this
    borderRadius: theme.borderRadius,
  },
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
  oracleSidebarContainer: {
    padding: `${theme.padding.lg.px}`,
    overflowX: 'hidden',
    borderLeft: `${theme.border}`,
    textAlign: 'right',
    [theme.breakpoints.down('xs')]: {
      padding: theme.padding.xs.px,
      textAlign: 'left',
    },
    '& h2': {
      [theme.breakpoints.down('xs')]: {
        paddingLeft: 0,
      },
    },
  },
});

export default styles;
