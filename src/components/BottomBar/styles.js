const styles = (theme) => ({
  bottomBarWrapper: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    padding: `${theme.padding.unit.px} ${theme.padding.sm.px}`,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
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
    textAlign: 'right',
  },
  bottomBarBlockNum: {
    marginRight: theme.padding.xs.px,
  },
});

export default styles;
