const styles = (theme) => ({
  bottomBarWrapper: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    padding: `${theme.padding.spaceX.px} ${theme.padding.space3X.px}`,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    [theme.breakpoints.down('sm')]: {
      padding: `${theme.padding.spaceX.px}`,
    },
  },
  bottomBarNetworkWrapper: {
    flexBasis: 130,
  },
  bottomBarNetworkIcon: {
    marginBottom: '-2px',
    marginRight: '4px',
    width: 14,
    height: 14,
    '&.online': {
      color: theme.palette.secondary.main,
    },
    '&.offline': {
      color: 'red',
    },
  },
  bottomBarBlockInfoWrapper: {
    flexBasis: 490,
    textAlign: 'right',
  },
  bottomBarBlockNum: {
    paddingRight: theme.padding.spaceX.px,
  },
  bottomBarBlockTime: {

  },
  bottomBarTxt: {
    [theme.breakpoints.down('sm')]: {
      fontSize: theme.sizes.font.xxSmall.px,
    },
  },
});

export default styles;
