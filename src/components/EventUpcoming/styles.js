const styles = (theme) => ({
  warningWrapper: {
    borderRadius: theme.borderRadius,
    overflow: 'hidden',
    padding: `${theme.padding.unit.px} ${theme.padding.xs.px}`,
    marginBottom: theme.padding.sm.px,
  },
  upcoming: {
    background: '#F5A6231A',
    border: 'solid 1px #F5A623',
    fontFamily: 'Lato',
    fontWeight: 'bold',
    color: '#F5A623',
  },
});

export default styles;
