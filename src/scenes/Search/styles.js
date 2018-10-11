const styles = (theme) => ({
  searchTabWrapper: {
    position: 'sticky',
    background: theme.palette.background.paper,
    top: 0,
    left: 0,
    right: 0,
    height: '56px',
    width: '90%',
  },
  searchTabButton: {
    marginTop: '0px',
    marginBottom: '0px',
    paddingTop: '3px',
    paddingBottom: '5px',
    height: '56px',
    color: 'black',
  },
  searchTabContainer: {
    marginTop: theme.sizes.navHeight.px,
  },
});

export default styles;
