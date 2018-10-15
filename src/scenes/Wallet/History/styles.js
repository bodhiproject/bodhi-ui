const styles = (theme) => ({
  txHistoryPaper: {
    overflow: 'visible',
    boxShadow: 'none',
    borderRadius: theme.borderRadius,
    background: theme.palette.background.paper,
  },
  txHistoryGridContainer: {
    padding: theme.padding.md.px,
  },
  tableWrapper: {
    width: '100%',
    overflowX: 'auto',
  },
  table: {
    marginTop: theme.padding.sm.px,
  },
});

export default styles;
