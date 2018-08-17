const styles = (theme) => ({
  myBalancePaper: {
    minWidth: theme.sizes.table.minWidth,
    overflowX: 'visible',
    boxShadow: 'none',
    borderRadius: theme.borderRadius,
    background: theme.palette.background.paper,
  },
  myBalanceGridContainer: {
    padding: theme.padding.md.px,
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
  tableHeaderItemText: {
    fontWeight: theme.typography.fontWeightBold,
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
