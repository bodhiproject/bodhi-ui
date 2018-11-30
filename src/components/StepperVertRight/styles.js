const styles = (theme) => ({
  stepperVertRightWrapper: {
    position: 'relative',
    left: '100%',
    background: 'transparent',
    marginLeft: '-'.concat(theme.padding.space5X.px),
    [theme.breakpoints.down('sm')]: {
      textAlign: 'left',
      padding: 0,
      left: 0,
      marginLeft: 0,
    },
  },
  stepperVertRightLabel: {
    '& > span:last-of-type': {
      position: 'relative',
      right: '100%',
      paddingRight: theme.padding.spaceX.px,
      [theme.breakpoints.down('sm')]: {
        right: 0,
      },
    },
    '& > span:last-of-type > span > span': {
      marginTop: '2px',
    },
  },
});

export default styles;
