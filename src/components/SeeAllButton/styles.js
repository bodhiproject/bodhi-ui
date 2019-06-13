const styles = (theme) => ({
  bottomButton: {
    borderTop: theme.border,
    textAlign: 'center',
    '&:hover': {
      cursor: 'pointer',
    },
  },
  bottomButtonText: {
    marginTop: theme.padding.space2X.px,
    '&:active': {
      transform: 'translateY(4px)',
    },
  },
  bottomButtonIcon: {
    verticalAlign: 'text-bottom',
  },
});

export default styles;
