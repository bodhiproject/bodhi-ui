const styles = (theme) => ({
  tableWrapper: {
    [theme.breakpoints.down('xs')]: {
      width: '100%',
      overflowX: 'auto',
    },
  },
  table: {
    background: 'rgb(249,249,249)',
    border: '8px',
  },
  tableCell: {
    padding: '0px',
  },
  tableRow: {
    height: '9px',
  },
  lastRow: {
    color: 'black',
    fontWeight: 'bold',
  },
  root: {
    '&:last-child': {
      paddingRight: 0,
      paddingLeft: '20px',
    },
  },
});

export default styles;
