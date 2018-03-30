const styles = (theme) => ({
  outcomeWrapper: {
    position: 'relative',
  },
  removeOutcome: {
    position: 'absolute',
    top: theme.padding.unit.px,
    right: 0,
    cursor: 'pointer',
  },
  inputButton: {
    marginTop: theme.padding.unit.px,
  },
  outcomeList: {
    listStyleType: 'none',
    padding: 0,
  },
});

export default styles;
