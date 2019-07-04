const styles = (theme) => ({
  pickerTab: {
    margin: 0,
    marginTop: 0,
    paddingTop: 10,
    padding: 10,
    maxWidth: '100%',
  },
  subTableContainer: {
  },
  mainTableContainer: {
    [theme.breakpoints.up('sm')]: {
      marginTop: theme.padding.space5X.px,
    },
  },
});

export default styles;
