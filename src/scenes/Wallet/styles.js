const styles = (theme) => ({
  rootPaper: {
    boxShadow: 'none',
    borderRadius: theme.borderRadius,
  },
  containerGrid: {
    padding: theme.padding.lg.px,
    overflowX: 'hidden',
    '&.right': {
      borderLeft: theme.border,
      textAlign: 'right',
    },
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
    marginTop: theme.padding.md.px,
  },
  tableHeader: {
    background: theme.palette.background.grey,
  },
  tableHeaderItemText: {
    fontWeight: theme.typography.fontWeightBold,
  },
  tableRowCell: {
    paddingTop: theme.padding.sm.px,
    paddingBottom: theme.padding.sm.px,
  },
  tableRowCopyButton: {
    color: theme.palette.primary.main,
  },
  tableRowCopyButtonIcon: {
    marginRight: theme.padding.unit.px,
  },
  tableRowActionButton: {
    marginRight: theme.padding.xs.px,
    borderRadius: 2,
  },
});

export default styles;
