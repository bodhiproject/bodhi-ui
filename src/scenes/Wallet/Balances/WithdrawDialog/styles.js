const styles = (theme) => ({
  fromLabel: {
    marginBottom: theme.padding.unit.px,
  },
  fromAddress: {
    color: theme.palette.primary.main,
    marginBottom: theme.padding.sm.px,
  },
  toAddress: {
    marginBottom: theme.padding.md.px,
  },
  inputContainer: {
    display: 'inline-block',
  },
  amountInput: {
    width: 300,
    marginRight: theme.padding.xs.px,
    marginBottom: theme.padding.xs.px,
  },
});

export default styles;
