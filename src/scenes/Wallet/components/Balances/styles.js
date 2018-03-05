const styles = (theme) => ({
  myBalancePaper: {
    boxShadow: 'none',
    borderRadius: theme.borderRadius,
    background: theme.palette.background.paper,
  },
  myBalanceGridContainer: {
    minWidth: theme.sizes.table.minWidth,
    padding: theme.padding.lg.px,
    overflowX: 'scroll',
  },
  myBalanceTitle: {
    marginBottom: theme.padding.xs.px,
  },
  totalsContainerGrid: {
    marginBottom: theme.padding.sm.px,
  },
  totalsItemGrid: {
    marginRight: theme.padding.md.px,
  },
  totalsItemAmount: {
    fontSize: theme.sizes.font.titleMd,
    marginBottom: 2,
  },
  table: {
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
    height: 42,
    padding: theme.padding.unit.px,
    background: theme.palette.background.paper,
    borderBottom: theme.border,
    '&.dark': {
      background: theme.palette.background.grey,
    },
  },
  tableRowCopyButton: {
    color: theme.palette.primary.main,
  },
  tableRowCopyButtonIcon: {
    width: 12,
    height: 12,
    marginRight: theme.padding.unit.px,
  },
  tableRowCopyButtonText: {
    color: theme.palette.primary.main,
  },
  tableRowActionButton: {
    minHeight: 24,
    fontSize: 12,
    marginRight: theme.padding.unit.px,
    borderRadius: 2,
  },
});

export default styles;
