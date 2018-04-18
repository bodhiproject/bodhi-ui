const styles = (theme) => ({
  historyTable: {
    overflowX: 'scroll',
  },
  viewEventLink: {
    '&:hover': {
      color: '#585AFA',
      cursor: 'pointer',
    },
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
  rotate: {
    transition: 'all 0.2s linear',
  },
  rotatedown: {
    transform: 'rotate(180deg)',
  },
});

export default styles;
