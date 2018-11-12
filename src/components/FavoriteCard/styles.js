const styles = (theme) => ({
  eventCard: {
    position: 'relative',
    borderRadius: '0px',
    boxShadow: '0px 0px 20px 0px rgba(0,0,0,0.05)',
    border: '1px solid rgba(0,0,0,0.25)',
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
    padding: theme.padding.space2X.px,
    '&.top': {
      height: '100px',
    },
  },
  dashboardTime: {
    color: theme.palette.text.hint,
    fontWeight: '500',
    display: 'block',
    paddingBottom: theme.padding.spaceX.px,
  },
  eventCardName: {
    marginBottom: theme.padding.space2X.px,
    display: 'block',
    maxHeight: '1.4em',
    maxWidth: '100%',
    fontSize: theme.sizes.font.medium,
    margin: '0 auto',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    fontWeight: '600',
    color: 'rgba(0,0,0,0.75)',
  },
  dashBoardCardIcon: {
    marginRight: theme.padding.spaceX.px,
  },
  eventCardInfo: {
    bottom: theme.padding.space3X.px,
    color: theme.palette.text.primary,
  },
  eventCardInfoItem: {
    padding: '3px 0px',
    display: 'inline',
  },
});

export default styles;
