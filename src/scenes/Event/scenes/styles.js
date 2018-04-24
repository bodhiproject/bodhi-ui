const styles = (theme) => ({
  importantNoteContainer: {
    margin: `${theme.padding.xs.px} ${theme.padding.xs.px} 0px ${theme.padding.xs.px}`,
  },
  eventDetailPaper: {
    boxShadow: 'none',
    borderRadius: theme.borderRadius,
  },
  eventDetailContainerGrid: {
    padding: theme.padding.lg.px,
    overflowX: 'hidden',
    '&.right': {
      borderLeft: theme.border,
      textAlign: 'right',
    },
  },
  withdrawOptionsWrapper: {
    padding: theme.padding.md.px,
  },
  withdrawContainerSection: {
    width: '100%',
    display: 'block',
    position: 'relative',
    paddingLeft: theme.padding.md.px,
    marginBottom: theme.padding.md.px,
    '&.last': {
      margin: 0,
    },
    '&.option': {
      marginBottom: theme.padding.sm.px,
    },
  },
  withdrawContainerSectionLabel: {
    marginBottom: theme.padding.xs.px,
  },
  withdrawContainerSectionIcon: {
    height: theme.sizes.icon,
    width: theme.sizes.icon,
    lineHeight: 1,
    fontSize: theme.sizes.icon,
    color: theme.palette.text.primary,
    position: 'absolute',
    left: 0,
    top: '-7px',
  },
  withdrawToken: {
    fontSize: theme.sizes.font.textSm,
    fontWeight: theme.typography.fontWeightBold,
  },
  withdrawRewardWrapper: {
    display: 'inline-block',
    marginBottom: theme.padding.unit.px,
  },
  withdrawRewardDivider: {
    display: 'inline-block',
    width: '1px',
    height: '75px',
    background: theme.palette.divider,
    marginLeft: theme.padding.md.px,
    marginRight: theme.padding.md.px,
  },
  eventDetailTitle: {
    marginBottom: theme.padding.md.px,
  },
  eventActionButton: {
    marginTop: theme.padding.md.px,
    backgroundColor: `${theme.palette.primary.main} !important`,
    color: 'white !important',
  },
  withdrawPaper: {
    padding: theme.padding.md.px,
  },
  eventOptionNum: {
    background: theme.palette.background.grey,
    height: theme.sizes.icon,
    width: theme.sizes.icon,
    lineHeight: theme.sizes.icon,
    borderRadius: theme.sizes.icon,
    overflow: 'hidden',
    textAlign: 'center',
    fontSize: theme.sizes.font.meta,
    fontWeight: theme.typography.fontWeightBold,
    color: theme.palette.text.primary,
    position: 'absolute',
    left: 0,
    top: 0,
  },
  withdrawWinningOption: {
    color: theme.palette.primary.main,
    fontSize: theme.sizes.font.titleSm,
    fontWeight: theme.typography.fontWeightBold,
    marginBottom: theme.padding.unit.px,
  },
  withdrawWinningOptionSmall: {
    color: theme.palette.primary.main,
  },
  eventUnconfirmedText: {
    marginTop: theme.padding.sm.px,
  },
  pending: {
    color: theme.palette.secondary.main,
  },
  withdrawn: {
    color: theme.palette.primary.main,
  },
});

export default styles;
