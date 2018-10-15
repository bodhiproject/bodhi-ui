const styles = (theme) => ({
  withdrawingPaper: {
    padding: theme.padding.md.px,
    [theme.breakpoints.down('md')]: {
      padding: theme.padding.xs.px,
    },
    [theme.breakpoints.down('xs')]: {
      padding: `${theme.padding.xs.px} ${theme.padding.unit.px}`,
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
    marginBottom: theme.padding.unit.px,
    minWidth: '10%',
    margin: '0 auto',
  },
  tokenDiv: {
    fontSize: theme.sizes.font.textSm,
    fontWeight: theme.typography.fontWeightBold,
  },
});

export default styles;
