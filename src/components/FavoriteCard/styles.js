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
  },
  headerContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.padding.space2X.px,
  },
  eventNameText: {
    flex: 1,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  infoItem: {
    marginBottom: 4,
  },
  infoIcon: {
    marginRight: theme.padding.spaceX.px,
  },
});

export default styles;
