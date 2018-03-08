const styles = (theme) => ({
  eventDetailPaper: {
    boxShadow: 'none',
    borderRadius: theme.borderRadius,
  },
  eventDetailContainerGrid: {
    padding: theme.padding.lg.px,
    overflowX: 'hidden',
    '&.right': {
      borderLeft: theme.border,
      textAlign: 'right',
    },
  },
  eventDetailTitle: {
    marginBottom: theme.padding.md.px,
  },
  eventActionButton: {
    marginTop: theme.padding.md.px,
  },
});

export default styles;
