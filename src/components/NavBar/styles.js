const styles = (theme) => ({
  navBar: {
    boxShadow: 'none',
  },
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
  navEventsButton: {
    color: 'rgba(255,255,255,0.65)',
    fontWeight: 400,
    '&.selected': {
      color: 'white',
    },
    '&:hover': {
      color: 'white',
    },
  },
  navBarLink: {
    position: 'relative',
  },
  navArrow: {
    width: '16px',
    height: '8px',
    position: 'absolute',
    bottom: '-16px',
    left: '50%',
    marginLeft: '-4px',
    '&.right': {
      bottom: '-28px',
    },
  },
});

export default styles;
