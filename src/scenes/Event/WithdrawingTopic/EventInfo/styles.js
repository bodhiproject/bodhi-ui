const styles = (theme) => ({
  eventInfoWrapper: {
    paddingBottom: theme.padding.space5X.px,
    [theme.breakpoints.down('xs')]: {
      padding: theme.padding.space2X.px,
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
    paddingLeft: theme.padding.space5X.px,
    fontSize: theme.typography.fontSize,
  },
});

export default styles;
