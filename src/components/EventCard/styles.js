const styles = (theme) => ({
  eventCard: {
    position: 'relative',
    borderRadius: '5px',
    boxShadow: '0px 0px 20px 0px rgba(0,0,0,0.05)',
    border: '2px solid rgba(0,0,0,0.075)',
    '&:hover': {
      boxShadow: '0px 5px 20px 3px rgba(0,0,0,0.1)',
      transform: 'translateY(-2px)',
      transition: '.1s all ease-in-out',
    },
    '&:active': {
      opacity: '0.9',
    },
  },
  eventCardSection: {
    position: 'relative',
    padding: theme.padding.space3X.px,
    '&.top': {
      height: '320px',
    },
    '&.button': {
      textAlign: 'center',
      paddingTop: theme.padding.space2X.px,
      paddingBottom: theme.padding.space2X.px,
      lineHeight: 1,
      fontSize: theme.sizes.font.small,
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
    marginBottom: theme.padding.space2X.px,
    display: '-webkit-box', // For multiline text overflow ellipsis
    maxHeight: '160px',
    margin: '0 auto',
    WebkitLineClamp: 5, // For multiline text overflow ellipsis
    WebkitBoxOrient: 'vertical', // For multiline text overflow ellipsis
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    fontWeight: '700',
    color: 'rgba(0,0,0,0.75)',
  },
  eventCardNameBundle: {
    display: 'flex',
  },
  eventCardNameFlex: {
    flex: 1,
  },
  unconfirmedTag: {
    background: theme.palette.secondary.light,
    color: theme.palette.secondary.main,
    border: `solid 1px ${theme.palette.secondary.main}`,
    borderRadius: theme.borderRadius,
    padding: `2px ${theme.padding.spaceX.px}`,
    marginBottom: theme.padding.spaceX.px,
    fontSize: theme.sizes.font.xxSmall,
  },
  dashBoardCardIcon: {
    marginRight: theme.padding.spaceX.px,
  },
  eventCardInfo: {
    position: 'absolute',
    bottom: theme.padding.space3X.px,
    color: theme.palette.text.primary,
  },
  eventCardInfoItem: {
    padding: '3px 0px',
  },
});

export default styles;
