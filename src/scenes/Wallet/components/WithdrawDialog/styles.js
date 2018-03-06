const styles = (theme) => ({
  depositAddress: {
    color: theme.palette.primary.main,
    padding: theme.padding.xs.px,
    marginBottom: theme.padding.xs.px,
    border: theme.border,
    borderRadius: theme.borderRadius,
  },
  qtumAmount: {
    marginBottom: theme.padding.unit.px,
  },
  botAmount: {
    marginBottom: theme.padding.sm.px,
  },
  withdrawInputContainer: {
    display: 'inline-block',
  },
  amountInput: {
    width: 300,
    marginRight: theme.padding.xs.px,
    marginBottom: theme.padding.xs.px,
  },
});

export default styles;
