const styles = (theme) => ({
  detailTxWrapper: {
    marginTop: theme.padding.space5X.px,
  },
  detailTxTitle: {
    marginBottom: theme.padding.space2X.px,
  },
  arrowSize: {
    fontSize: '8px',
  },
  centeredDiv: {
    display: 'grid',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: '20px',
  },
  card: {
    height: '50%',
    borderRadius: '10px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
    marginTop: theme.padding.space2X.px,
  },
  grid: {
    borderTop: theme.border,

  },
  bold: {
    fontWeight: '900',
  },
  note: {
    marginTop: '10px',
    marginBottom: '10px',
  },
  link: {
    color: '#4D51F9',
  },
  content: {
    width: '80%',
  },
});

export default styles;
