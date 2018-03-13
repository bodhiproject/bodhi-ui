const styles = (theme) => ({
  warningWrapper: {
    background: theme.palette.primary.light,
    color: theme.palette.primary.main,
    border: `solid 1px ${theme.palette.primary.main}`,
    borderRadius: theme.borderRadius,
    overflow: 'hidden',
    padding: `${theme.padding.unit.px} ${theme.padding.xs.px}`,
    marginBottom: theme.padding.sm.px,
    '&.error': {
      background: theme.palette.error.light,
      color: theme.palette.error.main,
      border: `solid 1px ${theme.palette.error.main}`,
    },
    '&.highlight': {
      background: theme.palette.secondary.light,
      color: theme.palette.secondary.main,
      border: `solid 1px ${theme.palette.secondary.main}`,
    },
  },
});

export default styles;
