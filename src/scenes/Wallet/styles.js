const styles = (theme) => ({
  rootPaper: {
    boxShadow: 'none',
    borderRadius: theme.borderRadius,
  },
  containerGrid: {
    padding: theme.padding.lg.px,
    overflowX: 'hidden',
  },
  myBalanceTitle: {
    marginBottom: theme.padding.md.px,
  },
  totalsContainerGrid: {
    marginBottom: theme.padding.lg.px,
  },
  totalsItemGrid: {
    marginRight: theme.padding.md.px,
  },
  totalsItemAmount: {
    marginBottom: theme.padding.unit.px,
  },
  table: {
    border: theme.border,
    marginTop: theme.padding.md.px,
  },
  tableHeader: {
    height: 40,
    background: theme.palette.background.grey,
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
    marginRight: theme.padding.unit.px,
  },
  tableRowActionButton: {
    minHeight: 24,
    fontSize: 12,
    marginRight: theme.padding.unit.px,
    borderRadius: 2,
  },
});

export default styles;
