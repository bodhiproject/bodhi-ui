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
  escrowAmountNote: {
    margin: `${theme.padding.sm.px} 0 0 0`,
  },
  createEventTextField: {
    [theme.breakpoints.down('xs')]: {
      fontSize: 12,
    },
  },
  createEventInputAdornment: {
    [theme.breakpoints.down('xs')]: {
      fontSize: 12,
      paddingTop: 8,
    },
  },
  selectAddressButton: {
    marginBottom: theme.padding.unit.px,
  },
  footer: {
    margin: theme.padding.sm.px,
  },
});

export default styles;
