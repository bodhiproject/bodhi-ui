const styles = (theme) => ({
  txHistoryPaper: {
    minWidth: theme.sizes.table.minWidth,
    overflowX: 'scroll',
    boxShadow: 'none',
    borderRadius: theme.borderRadius,
    background: theme.palette.background.paper,
  },
  txHistoryGridContainer: {
    padding: theme.padding.md.px,
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
