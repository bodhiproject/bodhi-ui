const styles = (theme) => ({
  eventNameText: {
    textDecoration: 'underline',
    '&:hover': {
      color: '#585AFA',
      cursor: 'pointer',
    },
  },
  arrowIcon: {
    fontSize: '8px',
    cursor: 'pointer',
  },
  show: {
    display: 'table-row',
  },
  hide: {
    display: 'none',
  },
  card: {
    color: 'black',
    height: '50%',
    borderRadius: '10px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
    transition: 'all 0.3s cubic-bezier(.25,.8,.25,1)',
    '&:hover': {
      boxShadow: '0 3px 6px rgba(0,0,0,0.25), 0 5px 5px rgba(0,0,0,0.22)',
    },
  },
  grid: {
    borderBottom: theme.border,
    marginBottom: theme.padding.space3X.px,
  },
  bold: {
    fontWeight: 'bold',
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
