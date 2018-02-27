const styles = (theme) => ({
  predictionInfoWrapper: {
    paddingBottom: theme.padding.md.px,
  },
  predictionInfoBlock: {
    marginBottom: '36px',
  },
  predictionInfo: {
    marginTop: theme.padding.unit.px,
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    paddingLeft: theme.padding.lg.px,
  },
});

export default styles;
