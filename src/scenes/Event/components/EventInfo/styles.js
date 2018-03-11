const styles = (theme) => ({
  eventInfoWrapper: {
    paddingBottom: theme.padding.md.px,
  },
  eventInfoBlock: {
    marginBottom: '36px',
  },
  eventInfo: {
    marginTop: theme.padding.unit.px,
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    paddingLeft: theme.padding.md.px,
    fontSize: theme.typography.fontSize,
  },
});

export default styles;
