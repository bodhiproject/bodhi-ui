const styles = (theme) => ({
  dashBoardCardSection: {
    padding: theme.padding.sm.px,
    '&.top': {
      height: '350px',
    },
    '&.button': {
      textAlign: 'center',
      paddingTop: theme.padding.xs.px,
      paddingBottom: theme.padding.xs.px,
      lineHeight: 1,
      fontSize: theme.sizes.font.textMd,
      color: theme.palette.text.primary,
    },
  },
});

export default styles;
