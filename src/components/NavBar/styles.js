const styles = (theme) => ({
  navBarWrapper: {
    padding: `${theme.padding.xs.px} ${theme.padding.sm.px}`,
  },
  navBarRightWrapper: {
    position: 'absolute',
    right: theme.padding.sm.px,
    top: theme.padding.xs.px,
  },
  navBarLogo: {
    height: '38px',
    verticalAlign: 'middle',
  },
  navBarWalletIcon: {
    marginRight: theme.padding.unit.px,
    verticalAlign: 'middle',
  },
  navBarWalletButton: {
    color: 'white',
    fontWeight: 400,
    marginRight: theme.padding.sm.px,
  },
  navBarRightButton: {
    color: 'white',
    fontWeight: 400,
    background: theme.palette.primary.dark,
    marginLeft: theme.padding.unit.px,
  },
});

export default styles;
