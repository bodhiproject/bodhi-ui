const styles = (theme) => ({
  txHistoryPaper: {
    minWidth: theme.sizes.table.minWidth,
    overflow: 'visible',
    boxShadow: 'none',
    borderRadius: theme.borderRadius,
    background: theme.palette.background.paper,
  },
  txHistoryGridContainer: {
    padding: theme.padding.md.px,
  },
  table: {
    marginTop: theme.padding.sm.px,
    overflow: 'scroll',
  },
});

export default styles;
