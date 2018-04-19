const styles = (theme) => ({
  historyTable: {
    overflowX: 'scroll',
  },
  viewEventLink: {
    '&:hover': {
      color: '#585AFA',
      cursor: 'pointer',
    },
    textDecoration: 'underline',
  },
  clickToExpandRow: {
    cursor: 'pointer',
  },
  summaryRowCell: {
    paddingTop: '24px',
    paddingBottom: '24px',
  },
  hide: {
    display: 'none',
  },
  show: {
    display: 'table-row',
  },
});

export default styles;
