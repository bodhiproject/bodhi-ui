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
  table: {
    marginTop: theme.padding.sm.px,
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
    paddingTop: theme.padding.xs.px,
    paddingBottom: theme.padding.sm.px,
    background: theme.palette.background.paper,
    borderBottom: theme.border,
  },
  tableRowCell: {
    padding: 0,
  },
});

export default styles;
