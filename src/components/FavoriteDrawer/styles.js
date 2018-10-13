const styles = (theme) => ({
  drawerPaper: {
    display: 'flex',
    width: 320,
    overflow: 'hidden',
    paddingTop: theme.sizes.navHeight.px,
  },
  drawerContainer: {
    overflowY: 'auto',
    overflowX: 'hidden',
    flex: 1,
  },
  drawerUnderNavbar: {
    zIndex: 999,
  },
});

export default styles;
