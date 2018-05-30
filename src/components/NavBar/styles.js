const styles = (theme) => ({
  navBar: {
    boxShadow: 'none',
  },
  navBarWrapper: {
    display: 'flex',
    padding: `0 ${theme.padding.sm.px}`,
    'align-items': 'center',
    height: '70px',
    'justify-content': 'space-between',
  },
  navSection: {
    display: 'flex',
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
  sides: {
    marginRight: theme.padding.unit.px,
    marginLeft: '32px',
  },
  dark: {
    color: 'white !important',
    fontWeight: 400,
    background: theme.palette.primary.dark,
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
  faq: {
    marginLeft: 10,
    color: 'white',
  },
  questionIcon: {
    marginRight: 2,
    '&:before': {
      fontSize: theme.sizes.icon,
    },
  },
  selectMenu: {
    color: 'white',
    paddingTop: 3,
    marginLeft: 25,
  },
});

export default styles;
