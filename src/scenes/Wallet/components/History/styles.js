const styles = (theme) => ({
  rootPaper: {
    boxShadow: 'none',
    borderRadius: theme.borderRadius,
    background: theme.palette.background.grey,
  },
  containerGrid: {
    padding: theme.padding.lg.px,
    overflowX: 'hidden',
  },
  title: {
    marginBottom: theme.padding.sm.px,
  },
  table: {
    border: theme.border,
  },
  tableHeader: {
    height: 42,
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
