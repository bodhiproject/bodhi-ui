const styles = (theme) => ({
  rootPaper: {
    // box-shadow: none !important; // TODO: fix this
    borderRadius: theme.borderRadius,
  },
  title: {
    marginBottom: theme.padding.space5X.px,
  },
  oracleButton: {
    marginTop: theme.padding.space5X.px,
    background: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },
  oracleContent: {
    padding: theme.padding.space7X.px,
    overflowX: 'hidden',
    [theme.breakpoints.down('xs')]: {
      padding: theme.padding.space2X.px,
    },
  },
  oracleSidebarContainer: {
    padding: `${theme.padding.space7X.px}`,
    overflowX: 'hidden',
    borderLeft: `${theme.border}`,
    textAlign: 'right',
    [theme.breakpoints.down('sm')]: {
      textAlign: 'left',
    },
    [theme.breakpoints.down('xs')]: {
      padding: theme.padding.space2X.px,
    },
    '& h2': {
      [theme.breakpoints.down('xs')]: {
        paddingLeft: 0,
      },
    },
  },
});

export default styles;
