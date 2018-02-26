const styles = (theme) => ({
  stepperVertRightWrapper: {
    position: 'relative',
    left: '100%',
    background: 'transparent',
    marginLeft: '-'.concat(theme.padding.md.px),
  },
  stepperVertRightLabel: {
    '& > span:last-of-type': {
      position: 'relative',
      right: '100%',
      paddingRight: theme.padding.unit.px,
    },
    '& > span:last-of-type > span > span': {
      marginTop: '2px',
    },
  },
});

export default styles;
