const styles = (theme) => ({
  selectWalletContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.padding.xs.px,
  },
  selectWalletText: {
    fontSize: theme.sizes.font.textSm,
    fontWeight: theme.typography.fontWeightBold,
    color: theme.palette.text.primary,
  },
});

export default styles;
