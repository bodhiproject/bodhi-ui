const styles = (theme) => ({
  card: {
    backgroundColor: 'white',
    padding: '20px',
    boxShadow: '0 5px 20px rgba(0,0,0,.3) !important',
    borderRadius: '12px !important',
    margin: '50px 0px 0px 0px',
    [theme.breakpoints.down('xs')]: {
      margin: '24px 0px 0px 0px',
    },
  },
});

export default styles;
