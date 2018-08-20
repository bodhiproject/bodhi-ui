const styles = (theme) => ({
  fromLabel: {
    marginBottom: theme.padding.unit.px,
  },
  fromAddress: {
    color: theme.palette.primary.main,
    marginBottom: theme.padding.sm.px,
  },
  toAddressInputContainer: {
    marginBottom: theme.padding.md.px,
  },
  amountInputContainer: {
    display: 'inline-block',
    marginBottom: theme.padding.xs.px,
  },
  amountInput: {
    width: 300,
    marginRight: theme.padding.xs.px,
  },
});

export default styles;
