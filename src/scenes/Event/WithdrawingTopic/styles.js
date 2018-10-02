const styles = (theme) => ({
  withdrawingPaper: {
    padding: theme.padding.md.px,
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
});

export default styles;
