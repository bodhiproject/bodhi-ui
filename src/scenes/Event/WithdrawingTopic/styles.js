const styles = (theme) => ({
  withdrawingPaper: {
    padding: theme.padding.space5X.px,
    [theme.breakpoints.down('md')]: {
      padding: theme.padding.space2X.px,
    },
    [theme.breakpoints.down('xs')]: {
      padding: `${theme.padding.space2X.px} ${theme.padding.spaceX.px}`,
    },
  },
  rewardTooltip: {
    background: '#FFFFFF',
    marginTop: '0px',
    marginBottom: '0px',
    paddingTop: '0px',
    paddingBottom: '0px',
  },
  rowDiv: {
    display: 'flex',
    flexDirection: 'row',
  },
  colDiv: {
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    marginBottom: theme.padding.spaceX.px,
    minWidth: '10%',
    margin: '0 auto',
  },
  tokenDiv: {
    fontSize: theme.sizes.font.xSmall,
    fontWeight: theme.typography.fontWeightBold,
  },
});

export default styles;
