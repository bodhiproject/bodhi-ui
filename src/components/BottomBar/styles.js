export default (theme) => ({
  paper: {
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
    [theme.breakpoints.up('sm')]: {
      '&.blockNum': {
        marginRight: theme.padding.space2X.px,
      },
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: theme.sizes.font.xxSmall,
    },
    [theme.breakpoints.up('xs')]: {
      '&.network': {
        marginRight: theme.padding.space2X.px,
      },
    },
  },
});
