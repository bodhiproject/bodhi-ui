export default theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: theme.padding.space4X.px,
    [theme.breakpoints.down('xs')]: {
      fontSize: theme.sizes.font.xxSmall,
    },
  },
  dialog: {
    textAlign: 'center',
    width: '70%',
  },
  icon: {
    width: 80,
    height: 80,
    marginBottom: theme.padding.space3X.px,
    [theme.breakpoints.down('xs')]: {
      width: 40,
      height: 40,
    },
  },
  text: {
    fontWeight: 'bold',
    marginBottom: theme.padding.space3X.px,
  },
  storeContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignContent: 'space-between',
  },
  badgeImg: {
    height: 40,
    [theme.breakpoints.down('xs')]: {
      height: 20,
      width: 60,
    },
  },
});
