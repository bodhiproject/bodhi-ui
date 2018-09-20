const styles = (theme) => ({
  selectWalletContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.padding.xs.px,
  },
  selectWalletText: {
    fontSize: theme.sizes.font.textSm,
    fontWeight: theme.typography.fontWeightBold,
    color: theme.palette.text.primary,
  },
  listItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: `${theme.padding.xs.px} 0`,
  },
  listItemPaper: {
    padding: theme.padding.xs.px,
  },
  listItemTxNumber: {
    fontWeight: theme.typography.fontWeightBold,
    marginBottom: theme.padding.xs.px,
  },
  txFeesTable: {
    marginBottom: theme.padding.xs.px,
    overflowX: 'scroll',
  },
  explanationMsgContainer: {
    marginBottom: theme.padding.xs.px,
  },
  actionButtonsContainer: {
    marginTop: theme.padding.xs.px,
  },
});

export default styles;
