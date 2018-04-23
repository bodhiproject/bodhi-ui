const styles = (theme) => ({
  tncBg: {
    background: 'white',
    position: 'fixed',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 999998,
    transition: 'opacity 1s;',
    overflowY: 'scroll',
    overflowX: 'hidden',
  },
  tncWrapper: {
    padding: theme.padding.sm.px,
  },
  title: {
    marginBottom: theme.padding.md.px,
  },
});

export default styles;
