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
    fontSize: theme.sizes.font.medium,
    [theme.breakpoints.down('xs')]: {
      fontSize: theme.sizes.font.xxSmall,
    },
  },
  searchBarInputBase: {
    height: '48px',
    lineHeight: '48px',
    padding: `0px ${theme.padding.space2X.px}`,
    borderLeft: `2px solid ${theme.palette.text.hint}`,
  },
  closeButton: {
    cursor: 'pointer',
  },
});
