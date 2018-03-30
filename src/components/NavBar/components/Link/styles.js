

const styles = () => ({
  navBarLink: {
    display: 'flex',
    'justify-content': 'center',
  },
  navArrow: {
    '&:after': {
      content: 'url(/images/nav-arrow.png)',
      position: 'absolute',
      top: '52px',
    },
  },
});

export default styles;
