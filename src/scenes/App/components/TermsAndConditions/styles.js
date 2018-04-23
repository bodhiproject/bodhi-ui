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
    margin: `${theme.padding.lg.px} 0px ${theme.padding.xs.px} 0px`,
    padding: theme.padding.sm.px,
  },
  title: {
    marginBottom: theme.padding.md.px,
  },
  acceptBtnContainer: {
    marginBottom: theme.padding.lg.px,
  },
  acceptButton: {
    padding: `0px ${theme.padding.md.px}`,
  },
});

export default styles;
