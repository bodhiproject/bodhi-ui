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
  },
  tokenDiv: {
    fontSize: theme.sizes.font.textSm,
    fontWeight: theme.typography.fontWeightBold,
  },
  withdrawListTableWrapper: {
    width: '100%',
    overflowX: 'auto',
  },
});

export default styles;
