const styles = (theme) => ({
  root: {
    borderRadius: theme.borderRadius,
    background: 'rgba(255, 255, 255,0)',
  },
  title: {
    marginBottom: theme.padding.space7X.px,
  },
  SidebarContainer: {
    padding: theme.padding.space7X.px,
    overflowX: 'hidden',
    borderLeft: `${theme.border}`,
    textAlign: 'right',
    [theme.breakpoints.down('xs')]: {
      padding: theme.padding.space2X.px,
      textAlign: 'left',
    },
    '& h2': {
      [theme.breakpoints.down('xs')]: {
        paddingLeft: 0,
      },
    },
  },
  card: {
    border: '2px solid #585AFA',
    margin: '32px 0px 32px 0px',
    maxWidth: '300px',
    background: 'rgba(255, 255, 255,0)',
  },
  cardHeader: {
    color: '#585AFA',
    fontSize: '1em',
    marginBottom: theme.padding.space3X.px,
  },
  cardContent: {
    color: '#585AFA',
    fontSize: '1.5em',
  },
});

export default styles;
