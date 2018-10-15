const styles = (theme) => ({
  detailTxWrapper: {
    marginTop: theme.padding.md.px,
  },
  detailTxTitle: {
    marginBottom: theme.padding.xs.px,
  },
  arrowSize: {
    fontSize: '8px',
  },
  centeredDiv: {
    display: 'grid',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: '20px',
  },
  transactionHistoryTableWrapper: {
    [theme.breakpoints.down('xs')]: {
      width: '100%',
      overflowX: 'auto',
    },
  },
});

export default styles;
