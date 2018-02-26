const styles = (theme) => ({
  predictionDetailPaper: {
    boxShadow: 'none',
    borderRadius: theme.borderRadius,
  },
  predictionDetailContainerGrid: {
    padding: theme.padding.lg.px,
    '&.right': {
      borderLeft: theme.border,
      textAlign: 'right',
    },
  },
  predictionDetailTitle: {
    marginBottom: theme.padding.md.px,
  },
  predictButton: {
    marginTop: theme.padding.md.px,
  },
});

export default styles;
