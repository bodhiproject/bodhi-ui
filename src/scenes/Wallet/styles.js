const styles = (theme) => ({
  infoPaper: {
    minWidth: theme.sizes.table.minWidth,
    overflowX: 'scroll',
    boxShadow: 'none',
    borderRadius: theme.borderRadius,
    background: theme.palette.background.paper,
    paddingTop: '10px',
    paddingLeft: theme.padding.md.px,
    marginBottom: '10px',
  },
});

export default styles;
