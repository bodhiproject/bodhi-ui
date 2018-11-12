const styles = (theme) => ({
  selectWalletContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.padding.space2X.px,
  },
  selectWalletText: {
    fontSize: theme.sizes.font.xSmall,
    fontWeight: theme.typography.fontWeightBold,
    color: theme.palette.text.primary,
  },
  listItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: `${theme.padding.space2X.px} 0`,
  },
  listItemPaper: {
    width: '100%',
    padding: theme.padding.space2X.px,
  },
  listItemTxNumber: {
    fontWeight: theme.typography.fontWeightBold,
    marginBottom: theme.padding.space2X.px,
  },
  txFeesTable: {
    marginBottom: theme.padding.space2X.px,
  },
  explanationMsgContainer: {
    marginBottom: theme.padding.space2X.px,
  },
  actionButtonsContainer: {
    marginTop: theme.padding.space2X.px,
  },
  buttonIcon: {
    fontSize: theme.sizes.icon.small,
    marginRight: 4,
  },
  confirmButton: {
    marginRight: theme.padding.spaceX.px,
  },
});

export default styles;
