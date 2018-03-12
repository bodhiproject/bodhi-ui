const styles = (theme) => ({
  eventCardSection: {
    position: 'relative',
    padding: theme.padding.sm.px,
    '&.top': {
      height: '320px',
    },
    '&.button': {
      textAlign: 'center',
      paddingTop: theme.padding.xs.px,
      paddingBottom: theme.padding.xs.px,
      lineHeight: 1,
      fontSize: theme.sizes.font.textMd,
      color: theme.palette.text.primary,
    },
  },
  dashboardTime: {
    color: theme.palette.text.hint,
  },
  eventCardName: {
    marginBottom: theme.padding.xs.px,
  },
  unconfirmedChip: {
    marginTop: theme.padding.unit.px,
  },
  dashBoardCardIcon: {
    marginRight: theme.padding.unit.px,
  },
  eventCardInfo: {
    position: 'absolute',
    bottom: theme.padding.sm.px,
    color: theme.palette.text.primary,
  },
});

export default styles;
