const styles = (theme) => ({
  loadingDialog: {
    width: 400,
    height: 200,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  title: {
    marginBottom: theme.padding.space5X.px,
    fontSize: theme.sizes.font.large,
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
    textAlign: 'right',
    borderTop: theme.border,
  },
  buttons: {
    marginTop: 16,
  },
  buttonIcon: {
    fontSize: theme.sizes.icon.small,
    marginRight: 4,
  },
  cancelButton: {
    marginRight: theme.padding.spaceX.px,
  },
  card: {
    color: 'black',
    boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
    transition: 'all 0.3s cubic-bezier(.25,.8,.25,1)',
    '&:hover': {
      boxShadow: '0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)',
    },
  },
  cardSelected: {
    color: '#fe0672',
  },
  textFieldInput: {
    height: '30px',
  },
  createContainer: {
    padding: `0 ${theme.padding.space2X.px} ${theme.padding.space2X.px}`,
  },
});

export default styles;
