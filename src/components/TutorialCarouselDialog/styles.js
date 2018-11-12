const styles = (theme) => ({
  tutorialDialogPaper: {
    [theme.breakpoints.down('xs')]: {
      margin: theme.padding.spaceX.px,
    },
  },
  tutorialDialog: {
    backgroundPosition: 'bottom',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    minHeight: 520,
    padding: '0 !important',
    position: 'relative',
    [theme.breakpoints.down('xs')]: {
      minHeight: 470,
    },
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
    marginBottom: theme.padding.space2X.px,
  },
  contentWrapper: {
    padding: `${theme.padding.space3X.px} ${theme.padding.space5X.px}`,
    [theme.breakpoints.down('xs')]: {
      padding: `${theme.padding.spaceX.px} ${theme.padding.space3X.px} 0 ${theme.padding.space3X.px}`,
    },
  },
  tutorialDialogContentWrapper: {
    height: 400,
    overflowY: 'auto',
    [theme.breakpoints.down('xs')]: {
      height: 350,
    },
  },
  tutorialDialogContentTitle: {
    [theme.breakpoints.down('sm')]: {
      fontSize: theme.sizes.font.xLarge,
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: theme.sizes.font.medium,
    },
  },
  contentList: {
    lineHeight: '28px',
    WebkitPaddingStart: '20px',
    [theme.breakpoints.down('xs')]: {
      margin: 0,
    },
  },
  tutorialDialogContentItem: {
    [theme.breakpoints.down('xs')]: {
      fontSize: theme.sizes.font.xxSmall,
    },
  },
  buttonsWrapper: {
    textAlign: 'center',
  },
  button: {
    margin: `${theme.padding.spaceX.px} ${theme.padding.space5X.px}`,
    display: 'inline-block',
    [theme.breakpoints.down('xs')]: {
      margin: `${theme.padding.spaceX.px} ${theme.padding.spaceX.px}`,
    },
  },
  link: {
    color: theme.palette.primary.main,
    wordWrap: 'break-word',
  },
  tncWrapper: {
    maxHeight: '300px',
    overflowY: 'scroll',
    marginTop: theme.padding.space2X.px,
    marginBottom: theme.padding.spaceX.px,
    padding: theme.padding.space3X.px,
    [theme.breakpoints.down('xs')]: {
      maxHeight: 260,
      fontSize: theme.sizes.font.xxSmall,
    },
  },
  tncAgreement: {
    fontWeight: 'bold',
    color: theme.palette.error.main,
    [theme.breakpoints.down('xs')]: {
      fontSize: theme.sizes.font.xxSmall,
    },
  },
  langBtn: {
    marginLeft: theme.padding.space2X.px,
    padding: `0px ${theme.padding.spaceX.px}`,
    border: theme.border,
    borderRadius: theme.borderRadius,
    [theme.breakpoints.down('xs')]: {
      fontSize: theme.sizes.font.xxSmall,
    },
  },
});

export default styles;
