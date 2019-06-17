const styles = (theme) => ({
  eventCard: {
    position: 'relative',
    borderRadius: '15px',
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
      height: '400px',
      [theme.breakpoints.down('xs')]: {
        height: 'auto',
      },
    },
    '&.button': {
      textAlign: 'center',
      paddingTop: theme.padding.space2X.px,
      paddingBottom: theme.padding.space2X.px,
      lineHeight: 1,
      fontSize: theme.sizes.font.small,
      color: theme.palette.text.primary,
    },
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  dashboardTime: {
    color: theme.palette.text.hint,
    fontWeight: '600',
    display: 'block',
    paddingBottom: '10px',
  },
  eventCardName: {
    maxHeight: '160px',
    margin: '0 auto',
    WebkitLineClamp: 5, // For multiline text overflow ellipsis
    WebkitBoxOrient: 'vertical', // For multiline text overflow ellipsis
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    fontWeight: '700',
    fontFamily: 'Noto Sans TC,sans-serif !important',
    color: '#3f4d5a',
    fontSize: '1.05rem',
    textAlign: 'left',
    whiteSpace: 'nowrap',
    [theme.breakpoints.down('xs')]: {
      maxHeight: 'none',
      overflow: 'visible',
      textOverflow: 'clip',
      whiteSpace: 'normal',
      wordBreak: 'break-word',
      textAlign: 'justify',
    },
  },
  eventCardNameBundle: {
    display: 'flex',
  },
  eventCardNameFlex: {
    flex: 1,
    minWidth: 0,
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
    bottom: theme.padding.space2X.px,
    color: theme.palette.text.primary,
  },
  stateText: {
    color: '#9aa5b1',
    textAlign: 'left',
    fontSize: '.82rem',
    fontWeight: '200',
    marginBottom: '.5rem',
  },
  eventCardInfoItem: {
    padding: `${theme.padding.spaceX.px} 0px 0px`,
  },
  upper: {
    [theme.breakpoints.down('xs')]: {
      marginBottom: theme.padding.space6X.px,
    },
  },
});

export default styles;
