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
    marginTop: theme.padding.space5X.px,
  },
  bottomButton: {
    borderTop: theme.border,
    textAlign: 'center',
  },
  bottomButtonText: {
    marginTop: theme.padding.space2X.px,
    '&:active': {
      transform: 'translateY(4px)',
    },
  },
  bottomButtonIcon: {
    verticalAlign: 'text-bottom',
  },
});

export default styles;
