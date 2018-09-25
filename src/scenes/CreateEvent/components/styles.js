const styles = (theme) => ({
  pickerTabx: {
    background: theme.palette.background.default,
  },
  pickerPaper: {
    width: 350,
    height: 300,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickerTab: {
    margin: 0,
    marginTop: 0,
    paddingTop: 10,
    padding: 10,
    flexGrow: 1,
  },
  pickerCalendar: {
    marginTop: 28,
    overflow: 'hidden',
    paddingLeft: 0,
    paddingRight: 0,
  },
  createEventSectionTitle: {
    fontSize: 16,
    [theme.breakpoints.down('xs')]: {
      marginTop: 5,
    },
  },
  createEventTextField: {
    [theme.breakpoints.down('xs')]: {
      fontSize: 12,
      height: '20px',
    },
  },
});

export default styles;
