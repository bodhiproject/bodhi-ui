const styles = (theme) => ({
  infoPaper: {
    minWidth: theme.sizes.table.minWidth,
    overflowX: 'scroll',
    boxShadow: 'none',
    borderRadius: theme.borderRadius,
    background: theme.palette.background.paper,
    padding: `${theme.padding.xs.px} ${theme.padding.md.px} ${theme.padding.unit.px} ${theme.padding.md.px}`,
    marginBottom: theme.padding.xs.px,
  },
});

export default styles;
