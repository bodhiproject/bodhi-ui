const styles = (theme) => ({
  eventCard: {
    position: 'relative',
    borderRadius: '5px',
    '&:hover': {
      boxShadow: '0px 5px 20px 1px rgba(0,0,0,0.25)',
      transform: 'translateY(-3px)',
      transition: '.2s all ease-in-out',
    },
  },
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
    fontWeight: '600',
    display: 'block',
    paddingBottom: '10px',
  },
  eventCardName: {
    marginBottom: theme.padding.xs.px,
    display: '-webkit-box',
    maxWidth: '400px',
    maxHeight: '160px',
    margin: '0 auto',
    WebkitLineClamp: 5,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    fontWeight: '600',
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
  eventCardInfoItem: {
    padding: '3px 0px',
  },
});

export default styles;
