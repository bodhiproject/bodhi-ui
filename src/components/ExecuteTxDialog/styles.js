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
    width: '100%',
    padding: theme.padding.xs.px,
  },
  listItemTxNumber: {
    fontWeight: theme.typography.fontWeightBold,
    marginBottom: theme.padding.xs.px,
  },
  txFeesTable: {
    marginBottom: theme.padding.xs.px,
  },
  explanationMsgContainer: {
    marginBottom: theme.padding.xs.px,
  },
  actionButtonsContainer: {
    marginTop: theme.padding.xs.px,
  },
  buttonIcon: {
    fontSize: theme.sizes.icon.small,
    marginRight: 4,
  },
  confirmButton: {
    marginRight: theme.padding.unit.px,
  },
});

export default styles;
