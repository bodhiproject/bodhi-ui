const styles = (theme) => ({
  txHistoryPaper: {
    boxShadow: 'none',
    borderRadius: theme.borderRadius,
    background: theme.palette.background.default,
  },
  txHistoryGridContainer: {
    minWidth: theme.sizes.table.minWidth,
    padding: theme.padding.lg.px,
    overflowX: 'scroll',
  },
  table: {
    marginTop: theme.padding.sm.px,
    border: theme.border,
  },
  tableHeader: {
    height: theme.sizes.table.headerHeight,
    background: theme.palette.background.grey,
  },
  tableHeaderItemText: {
    fontWeight: theme.typography.fontWeightBold,
  },
  tableRow: {
    paddingTop: theme.padding.xs.px,
    paddingBottom: theme.padding.sm.px,
    background: theme.palette.background.paper,
    borderBottom: theme.border,
  },
});

export default styles;
