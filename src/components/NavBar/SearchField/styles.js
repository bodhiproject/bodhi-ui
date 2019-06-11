export default (theme) => ({
  searchBarField: {
    margin: 'auto',
    display: 'flex',
    width: '90%',
  },
  searchBarLeftIcon: {
    fontSize: theme.sizes.font.medium,
    color: theme.palette.primary.main,
    paddingRight: theme.padding.space3X.value,
  },
  searchBarTextField: {
    width: '100%',
    margin: 'auto',
    verticalAlign: 'middle',
  },
  searchBarInput: {
    height: '40px',
  },
  searchBarInputBase: {
    borderLeft: `2px solid ${theme.palette.text.hint}`,
  },
  closeButton: {
    cursor: 'pointer',
  },
});
