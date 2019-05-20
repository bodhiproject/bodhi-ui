const styles = (theme) => ({
  drawerUnderNavbar: {
    zIndex: 999,
  },
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
  emptyContainer: {
    marginTop: theme.padding.space7X.px,
  },
  emptyTextContainer: {
    display: 'grid',
    marginTop: theme.padding.space3X.px,
    padding: theme.padding.space5X.px,
    textAlign: 'center',
  },
  emptyButtonContainer: {
    display: 'grid',
    justifyContent: 'center',
  },
});

export default styles;
