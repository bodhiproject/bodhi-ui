const styles = (theme) => ({
  myBalancePaper: {
    overflowX: 'visible',
    boxShadow: 'none',
    borderRadius: theme.borderRadius,
    background: theme.palette.background.paper,
  },
  myBalanceGridContainer: {
    padding: theme.padding.space5X.px,
  },
  myBalanceTitle: {
    marginBottom: theme.padding.space2X.px,
  },
  totalsContainerGrid: {
    marginBottom: theme.padding.space3X.px,
  },
  totalsItemGrid: {
    marginRight: theme.padding.space5X.px,
  },
  totalsItemAmount: {
    fontSize: theme.sizes.font.xLarge,
    marginBottom: 2,
  },
  tableHeaderItemText: {
    fontWeight: theme.typography.fontWeightBold,
  },
  tableRowCopyButton: {
    color: theme.palette.primary.main,
  },
  tableRowCopyButtonIcon: {
    width: 12,
    height: 12,
    marginRight: theme.padding.spaceX.px,
  },
  tableRowCopyButtonText: {
    color: theme.palette.primary.main,
  },
  tableRowActionButton: {
    minHeight: 24,
    fontSize: theme.sizes.font.xxSmall,
    marginRight: theme.padding.spaceX.px,
    borderRadius: 2,
  },
});

export default styles;
