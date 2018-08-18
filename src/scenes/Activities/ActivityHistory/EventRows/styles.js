const styles = () => ({
  summaryRowCell: {
    paddingTop: '24px',
    paddingBottom: '24px',
  },
  eventNameText: {
    textDecoration: 'underline',
    '&:hover': {
      color: '#585AFA',
      cursor: 'pointer',
    },
  },
  arrowIcon: {
    fontSize: '8px',
    cursor: 'pointer',
  },
  show: {
    display: 'table-row',
  },
  hide: {
    display: 'none',
  },
});

export default styles;
