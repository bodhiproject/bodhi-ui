export default (theme) => ({
  paper: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    padding: `${theme.padding.spaceX.px} ${theme.padding.space3X.px}`,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    [theme.breakpoints.down('sm')]: {
      padding: `${theme.padding.spaceX.px}`,
    },
    zIndex: 200,
  },
  statusContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIcon: {
    marginRight: 4,
    width: 16,
    height: 16,
    '&.online': {
      color: theme.palette.secondary.main,
    },
    '&.offline': {
      color: theme.palette.error.dark,
    },
  },
  blockInfoContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  blockItemContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  bottomBarTxt: {
    [theme.breakpoints.down('sm')]: {
      fontSize: theme.sizes.font.xxSmall,
    },
    textAlign: 'right',
  },
});
