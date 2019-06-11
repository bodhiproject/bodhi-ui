

const styles = (theme) => ({
  invalid: {
    '& > div': {
      'background-color': theme.palette.error.dark,
    },
  },
  root: {
    height: '100% !important',
    boxShadow: '0 2px 10px rgba(0,0,0,.2) !important',
    backgroundColor: 'white !important',
  },
  dashed: {
    animation: 'none',
    backgroundColor: 'white !important',
    backgroundImage: 'none !important',
  },
});

export default styles;
