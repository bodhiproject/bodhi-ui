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
    height: '100%',
  },
  drawerUnderNavbar: {
    zIndex: 999,
  },
  drawerPlaceHolder: {
    zIndex: 999,
  },
});

export default styles;
