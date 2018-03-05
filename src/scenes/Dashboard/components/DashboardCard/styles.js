const styles = (theme) => ({
  dashboardCardSection: {
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
  dashboardCardName: {
    marginBottom: theme.padding.xs.px,
  },
  dashBoardCardIcon: {
    marginRight: theme.padding.unit.px,
  },
  dashboardCardInfo: {
    position: 'absolute',
    bottom: theme.padding.sm.px,
    color: theme.palette.text.primary,
  },
});

export default styles;
