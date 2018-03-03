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
    border: theme.border,
    marginTop: theme.padding.md.px,
  },
  tableHeader: {
    height: 40,
    background: theme.palette.background.grey,
  },
  tableRowLight: {
    borderBottom: theme.border,
  },
  tableRowDark: {
    background: theme.palette.background.grey,
    borderBottom: theme.border,
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
    minHeight: 24,
    fontSize: 12,
    marginRight: theme.padding.unit.px,
    borderRadius: 2,
  },
});

export default styles;
