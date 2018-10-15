const styles = (theme) => ({
  eventInfoWrapper: {
    paddingBottom: theme.padding.md.px,
    [theme.breakpoints.down('xs')]: {
      padding: theme.padding.xs.px,
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
    marginTop: theme.padding.unit.px,
    wordWrap: 'break-word',
    paddingLeft: theme.padding.md.px,
    fontSize: theme.typography.fontSize,
  },
});

export default styles;
