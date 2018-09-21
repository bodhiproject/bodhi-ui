const styles = (theme) => ({
  createDialog: {
    overflowY: 'scroll',
    [theme.breakpoints.down('xs')]: {
      fontSize: 12,
    },
  },
  createDialogPaper: {
    [theme.breakpoints.down('xs')]: {
      margin: 0,
    },
  },
  createDialogTitle: {
    padding: `${theme.padding.xs.px} ${theme.padding.sm.px} 0 ${theme.padding.sm.px}`,
  },
  EscrowAmountNote: {
    [theme.breakpoints.down('xs')]: {
      margin: 0,
      padding: `${theme.padding.unit.px} ${theme.padding.sm.px}`,
    },
  },
});

export default styles;
