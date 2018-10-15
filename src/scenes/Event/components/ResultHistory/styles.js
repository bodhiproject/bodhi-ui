const styles = (theme) => ({
  detailTxWrapper: {
    marginTop: theme.padding.md.px,
    overflowY: 'auto',
  },
  detailTxTitle: {
    marginBottom: theme.padding.xs.px,
  },
  arrowSize: {
    fontSize: '8px',
  },
  eventResultHistoryTableWrapper: {
    [theme.breakpoints.down('xs')]: {
      width: '100%',
      overflowX: 'auto',
    },
  },
});

export default styles;
