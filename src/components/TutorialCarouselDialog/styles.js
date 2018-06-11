const styles = (theme) => ({
  tutorialDialog: {
    backgroundPosition: 'bottom',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    minHeight: '600px',
    minWidth: '880px',
    padding: '0 !important',
    position: 'relative',
  },
  tutorialDialog0: {
    backgroundImage: 'url(/images/carousel-bg-0.png)',
    '& $titleTopLine': {
      backgroundColor: '#DC3CAA',
    },
  },
  tutorialDialog1: {
    backgroundImage: 'url(/images/carousel-bg-1.png)',
    '& $titleTopLine': {
      backgroundColor: '#46AAFF',
    },
  },
  tutorialDialog2: {
    backgroundImage: 'url(/images/carousel-bg-2.png)',
    '& $titleTopLine': {
      backgroundColor: '#23DAE0',
    },
  },
  tutorialDialog3: {
    backgroundImage: 'url(/images/carousel-bg-3.png)',
    '& $titleTopLine': {
      backgroundColor: '#EF5257',
    },
  },
  tutorialDialog4: {
    backgroundImage: 'url(/images/carousel-bg-4.png)',
    '& $titleTopLine': {
      backgroundColor: '#00B4AA',
    },
  },
  tutorialDialog5: {
    backgroundImage: 'url(/images/carousel-bg-5.png)',
    '& $titleTopLine': {
      backgroundColor: '#2DAAB4',
    },
  },
  tutorialDialog6: {
    backgroundImage: 'url(/images/carousel-bg-6.png)',
    '& $titleTopLine': {
      backgroundColor: '#8850FF',
    },
  },
  tutorialDialog7: {
    backgroundImage: 'url(/images/tnc-bg.png)',
  },
  titleTopLine: {
    height: '5px',
    marginBottom: theme.padding.xs.px,
  },
  contentWrapper: {
    padding: `${theme.padding.sm.px} ${theme.padding.md.px} ${theme.padding.md.px} ${theme.padding.md.px} !important`,
  },
  contentList: {
    lineHeight: '28px',
    WebkitPaddingStart: '20px',
  },
  buttonsWrapper: {
    textAlign: 'center',
    position: 'absolute',
    bottom: theme.padding.lg.px,
    left: 0,
    right: 0,
  },
  button: {
    marginLeft: '50px',
    marginRight: '50px',
    display: 'inline-block',
  },
  link: {
    color: theme.palette.primary.main,
  },
  tncWrapper: {
    maxHeight: '300px',
    overflowY: 'scroll',
    marginTop: theme.padding.xs.px,
    marginBottom: theme.padding.unit.px,
    padding: theme.padding.sm.px,
  },
  tncAgreement: {
    fontWeight: 'bold',
    color: theme.palette.error.main,
  },
  langBtn: {
    marginLeft: theme.padding.xs.px,
    padding: `0px ${theme.padding.unit.px}`,
    border: theme.border,
    borderRadius: theme.borderRadius,
  },
});

export default styles;
