const styles = (theme) => ({
  myWalletPaper: {
    boxShadow: 'none',
    borderRadius: theme.borderRadius,
  },
  myWalletContainerGrid: {
    padding: theme.padding.lg.px,
    overflowX: 'hidden',
    '&.right': {
      borderLeft: theme.border,
      textAlign: 'right',
    },
  },
  myWalletTitle: {
    marginBottom: theme.padding.md.px,
  },
  totalsItemGrid: {
    marginRight: theme.padding.md.px,
  },
  totalsItemAmount: {
    marginBottom: theme.padding.unit.px,
  },
});

export default styles;
