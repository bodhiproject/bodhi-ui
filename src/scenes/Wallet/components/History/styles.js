const styles = (theme) => ({
  txHistoryPaper: {
    minWidth: theme.sizes.table.minWidth,
    overflow: 'scroll',
    boxShadow: 'none',
    borderRadius: theme.borderRadius,
    background: theme.palette.background.paper,
  },
  txHistoryGridContainer: {
    padding: theme.padding.md.px,
  },
  table: {
    marginTop: theme.padding.sm.px,
    overflow: 'scroll',
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
