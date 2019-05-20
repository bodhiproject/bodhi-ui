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
  favoriteSidebarPlacholderContainer: {
    marginTop: theme.padding.space7X.px,
  },
  favoriteSidebarPlacholderText: {
    display: 'grid',
    marginTop: theme.padding.space3X.px,
    padding: theme.padding.space5X.px,
    justifyContent: 'center',
  },
  favoriteSidebarPlacholderButton: {
    display: 'grid',
    justifyContent: 'center',
  },
});

export default styles;
