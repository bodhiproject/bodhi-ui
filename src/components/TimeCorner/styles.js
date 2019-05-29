export default (theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
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
});
