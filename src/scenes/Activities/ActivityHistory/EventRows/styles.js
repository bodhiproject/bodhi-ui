const styles = () => ({
  clickToExpandRow: {
    cursor: 'pointer',
  },
  summaryRowCell: {
    paddingTop: '24px',
    paddingBottom: '24px',
  },
  viewEventLink: {
    '&:hover': {
      color: '#585AFA',
      cursor: 'pointer',
    },
    textDecoration: 'underline',
  },
  arrowSize: {
    fontSize: '8px',
  },
  show: {
    display: 'table-row',
  },
  hide: {
    display: 'none',
  },
});

export default styles;
