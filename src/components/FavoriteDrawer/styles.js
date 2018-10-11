const styles = (theme) => ({
  drawerPaper: {
    position: 'relative',
    width: 320,
    overflow: 'hidden',
    paddingTop: theme.sizes.navHeight.px,
  },
  drawerContainer: {
    overflowY: 'auto',
    overflowX: 'hidden',
  },
  drawerUnderNavbar: {
    zIndex: 999,
  },
});

export default styles;
