const styles = (theme) => ({
  sidebarContainer: {
    padding: `0 ${theme.padding.space7X.px} ${theme.padding.space7X.px}`,
    overflowX: 'hidden',
    textAlign: 'right',
    [theme.breakpoints.down('sm')]: {
      textAlign: 'left',
    },
    [theme.breakpoints.down('xs')]: {
      padding: `0 0 ${theme.padding.space2X.px}`,
      overflowX: 'visible',
    },
    '& h2': {
      [theme.breakpoints.down('xs')]: {
        paddingLeft: 0,
      },
    },
  },
});

export default styles;
