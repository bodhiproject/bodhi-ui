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
    fontSize: theme.sizes.font.xSmall,
    [theme.breakpoints.down('xs')]: {
      marginTop: 4,
    },
  },
  createEventTextField: {
    [theme.breakpoints.down('xs')]: {
      fontSize: theme.sizes.font.xxSmall,
      height: 20,
    },
    color: 'black',
  },
  card: {
    boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
    transition: 'all 0.3s cubic-bezier(.25,.8,.25,1)',
    '&:hover': {
      boxShadow: '0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)',
    },
  },
});

export default styles;
