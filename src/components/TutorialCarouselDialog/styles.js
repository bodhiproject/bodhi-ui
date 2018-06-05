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
  titleTopLine: {
    height: '5px',
    marginBottom: theme.padding.xs.px,
  },
  contentWrapper: {
    padding: `${theme.padding.md.px} !important`,
  },
  contentList: {
    lineHeight: '28px',
    WebkitPaddingStart: '20px',
  },
  buttonsWrapper: {
    textAlign: 'center',
    position: 'absolute',
    bottom: '90px',
    left: 0,
    right: 0,
  },
  button: {
    marginLeft: '50px',
    marginRight: '50px',
    display: 'inline-block',
  },
  warning: {
    color: '#FF5000',
    fontWeight: theme.typography.fontWeightBold,
  },
  link: {
    color: theme.palette.primary.main,
  },
});

export default styles;
