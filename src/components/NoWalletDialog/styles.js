export default theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.four,
  },
  icon: {
    width: 80,
    height: 80,
  },
  loggedInText: {
    marginBottom: theme.spacing.three,
  },
  storeContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignContent: 'space-between',
  },
  badgeImg: {
    height: 40,
  },
})
