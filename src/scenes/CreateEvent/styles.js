const styles = (theme) => ({
  loadingDialog: {
    width: 400,
    height: 200,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  createDialog: {
    overflow: 'auto',
    [theme.breakpoints.down('xs')]: {
      fontSize: theme.sizes.font.xxSmall,
    },
  },
  createDialogPaper: {
    overflow: 'auto',
  },
  createDialogTitle: {
    padding: `${theme.padding.space2X.px} ${theme.padding.space3X.px}`,
    borderBottom: theme.border,
  },
  escrowAmountNote: {
    margin: `${theme.padding.space3X.px} 0 0 0`,
  },
  createEventTextField: {
    [theme.breakpoints.down('xs')]: {
      fontSize: theme.sizes.font.xxSmall,
    },
  },
  createEventInputAdornment: {
    [theme.breakpoints.down('xs')]: {
      fontSize: theme.sizes.font.xxSmall,
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
    marginTop: theme.padding.spaceX.px,
  },
  selectAddressButton: {
    marginBottom: theme.padding.spaceX.px,
  },
  footer: {
    borderTop: theme.border,
  },
  buttonIcon: {
    fontSize: theme.sizes.icon.small,
    marginRight: 4,
  },
  cancelButton: {
    marginRight: theme.padding.spaceX.px,
  },
});

export default styles;
