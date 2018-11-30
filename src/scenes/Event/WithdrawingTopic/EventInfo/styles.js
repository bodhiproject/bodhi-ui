const styles = (theme) => ({
  eventInfoWrapper: {
    paddingBottom: theme.padding.space5X.px,
    [theme.breakpoints.down('xs')]: {
      textAlign: 'left',
    },
    '& h2': {
      [theme.breakpoints.down('xs')]: {
        paddingLeft: 0,
      },
    },
  },
  eventInfoBlock: {
    marginBottom: '36px',
  },
  eventInfo: {
    marginTop: theme.padding.spaceX.px,
    wordWrap: 'break-word',
    fontSize: theme.typography.fontSize,
  },
});

export default styles;
