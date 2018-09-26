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
  removeOutcomeIcon: {
    position: 'absolute',
    right: 5,
    top: 8,
    cursor: 'pointer',
  },
  addOutcomeButton: {
    marginTop: theme.padding.unit.px,
  },
  selectAddressButton: {
    marginBottom: theme.padding.unit.px,
  },
  footer: {
    margin: theme.padding.sm.px,
  },
  buttonIcon: {
    fontSize: theme.sizes.icon.small,
    marginRight: 4,
  },
  cancelButton: {
    marginRight: theme.padding.unit.px,
  },
});

export default styles;
