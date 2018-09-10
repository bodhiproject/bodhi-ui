

const styles = () => ({
  resultWrapper: {
    boxShadow: '0px 0px 4px 0px rgba(0,0,0,0.25) inset',
    background: 'white',
    alignItems: 'flex-start',
    overflowY: 'scroll',
    height: 'calc(100vh - 70px)',
  },
  result: {
    margin: '40px',
    padding: '70px 40px 40px 40px',
  },
  hiddenModal: {
    display: 'none',
    visible: 'false',
  },
  testFullScreen: {
    position: 'absolute',
    height: '100vh',
    width: '100vw',
    background: 'yellow',
  },
});

export default styles;
