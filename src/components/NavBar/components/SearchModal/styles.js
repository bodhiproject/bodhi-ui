

const styles = () => ({
  resultWrapper: {
    boxShadow: '0px 0px 4px 0px rgba(0,0,0,0.25) inset',
    background: 'white',
    'align-items': 'flex-start',
    overflowY: 'scroll',
    height: '100vh',
    width: '100vw',
  },
  result: {
    margin: '40px',
    padding: '70px 40px 40px 40px',
  },
  hiddenModal: {
    display: 'none',
    visible: 'false',
  },
  fullScreenModal: {
    position: 'absolute',
    height: '20vh',
    width: '100vw',
    background: 'yellow',
  },
});

export default styles;
