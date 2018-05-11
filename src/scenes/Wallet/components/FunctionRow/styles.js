const styles = (theme) => ({
  functionRow: {
    minWidth: theme.sizes.table.minWidth,
    margin: '-30px 0px 20px 0px',
    textAlign: 'right',
  },
  button: {
    margin: `${theme.padding.xs.px} 12px ${theme.padding.unit.px} 12px`,
    border: '1px solid blue',
    background: 'white',
    boxShadow: 'none',
    color: 'blue',
    '&:hover': {
      background: '#585AFA',
      color: '#FFFFFF',
      boxShadow: '0px 1px 5px 0px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12)',
      border: '1px solid #585AFA',
    },
  },
});

export default styles;
