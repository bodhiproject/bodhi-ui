const styles = () => ({
  txidLabel: {
    width: '150px',
  },
  txidRow: {
    position: 'relative',
    height: '85px',
  },
  txidWrapper: {
    position: 'absolute',
    left: '24px',
    top: '4px',
    bottom: '4px',
    right: '24px',
    paddingTop: '18px',
  },
  txIdText: {
    '&:hover': {
      color: '#585AFA',
      cursor: 'pointer',
    },
    textDecoration: 'underline',
  },
});

export default styles;
