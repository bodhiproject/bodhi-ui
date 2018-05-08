const styles = (theme) => ({
  eventCardSection: {
    position: 'relative',
    padding: theme.padding.sm.px,
    '&.top': {
      minHeight: '320px',
      paddingBottom: '80px',
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
  unconfirmedTag: {
    background: theme.palette.secondary.light,
    color: theme.palette.secondary.main,
    border: `solid 1px ${theme.palette.secondary.main}`,
    borderRadius: theme.borderRadius,
    padding: `2px ${theme.padding.unit.px}`,
    marginBottom: theme.padding.unit.px,
    fontSize: theme.sizes.font.meta,
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
