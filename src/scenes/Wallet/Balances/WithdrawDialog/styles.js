const styles = (theme) => ({
  fromLabel: {
    marginBottom: theme.padding.spaceX.px,
  },
  fromAddress: {
    color: theme.palette.primary.main,
    marginBottom: theme.padding.space3X.px,
  },
  toAddressInputContainer: {
    marginBottom: theme.padding.space5X.px,
  },
  amountInputContainer: {
    display: 'inline-block',
    marginBottom: theme.padding.space2X.px,
  },
  amountInput: {
    width: 300,
    marginRight: theme.padding.space2X.px,
  },
});

export default styles;
