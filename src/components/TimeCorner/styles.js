export default (theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: theme.padding.space2X.px,
  },
  icon: {
    marginRight: theme.padding.spaceX.px,
  },
  badge: {
    float: 'right',
    padding: '8px',
    color: '#5f6d7c',
    fontWeight: '300',
    borderRadius: '9px',
    fontSize: '0.75rem',
    backgroundColor: '#f4f5f7',
  },
  hourText: {
    textAlign: 'righ',
    color: '#3f4d5a',
    fontWeight: '400',
    fontSize: '1.15rem',
    marginBottom: '.5rem',
  },
});
