

const styles = (theme) => ({
  invalid: {
    '& > div:nth-child(2)': {
      'background-color': theme.palette.error.dark,
    },
    '& > div:nth-child(3)': {
      'background-color': theme.palette.error.light,
    },
  },
  root: {
    height: '100% !important',
    boxShadow: '0 2px 10px rgba(0,0,0,.2) !important',
    backgroundColor: 'white !important',
  },
  dashed: {
    animation: 'none',
    backgroundImage: 'none !important',
    backgroundColor: 'white !important',
  },
});

export default styles;
