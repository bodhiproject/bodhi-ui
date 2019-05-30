export default (theme) => ({
  currentValue: {
    alignSelf: 'center',
    fontWeight: 'bold',
    padding: '0 6px',
    border: `1px solid ${theme.palette.primary.main}`,
    borderRadius: theme.borderRadius,
    bottom: -6,
  },
  sliderContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  slider: {
    flex: 1,
    margin: `0 ${theme.padding.space3X.px}`,
  },
});
