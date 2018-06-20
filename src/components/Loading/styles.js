

const styles = ({ palette: { primary } }) => ({
  '@keyframes loading': {
    '0%': {
      transform: 'rotate(0deg)',
    },
    '100%': {
      transform: 'rotate(360deg)',
    },
  },
  loading: {
    position: 'relative',
    boxSizing: 'border-box',
    width: '3rem',
    height: '3rem',
    display: 'inline-flex',
    margin: '10px 20px',
    borderRadius: '100%',
    background: `linear-gradient(${primary.main}, #fff)`,
    animation: 'loading 2s linear infinite',
    '&:before': {
      content: '""',
      position: 'absolute',
      boxSizing: 'border-box',
      width: '80%',
      height: '80%',
      left: '10%',
      top: '10%',
      background: '#fff',
      borderRadius: '100%',
    },
  },
  col: {
    display: 'flex',
    flexDirection: 'column',
    color: 'gray',
    alignItems: 'center',
  },
});

export default styles;
