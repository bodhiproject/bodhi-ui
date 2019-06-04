const styles = (theme) => ({
  sidebarContainer: {
    padding: `${theme.padding.space7X.px}`,
    overflowX: 'hidden',
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
