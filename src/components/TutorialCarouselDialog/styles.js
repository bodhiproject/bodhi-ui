const styles = (theme) => ({
  tutorialDialogPaper: {
    [theme.breakpoints.down('xs')]: {
      margin: 0,
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
    marginBottom: theme.padding.xs.px,
  },
  contentWrapper: {
    padding: `${theme.padding.sm.px} ${theme.padding.md.px} ${theme.padding.sm.px} ${theme.padding.md.px}`,
    [theme.breakpoints.down('xs')]: {
      padding: `${theme.padding.unit.px} ${theme.padding.sm.px} 0 ${theme.padding.sm.px}`,
    },
  },
  tutorialDialogContentWrapper: {
    height: 400,
    overflowX: 'auto',
    [theme.breakpoints.down('xs')]: {
      height: 340,
    },
  },
  tutorialDialogContentTitle: {
    [theme.breakpoints.down('sm')]: {
      fontSize: theme.sizes.font.titleMd,
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: theme.sizes.font.textLg,
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
      fontSize: 12,
    },
  },
  buttonsWrapper: {
    textAlign: 'center',
  },
  button: {
    margin: `${theme.padding.unit.px} ${theme.padding.md.px}`,
    display: 'inline-block',
    [theme.breakpoints.down('xs')]: {
      margin: `${theme.padding.unit.px} ${theme.padding.sm.px}`,
    },
  },
  buttonTxt: {
    [theme.breakpoints.down('xs')]: {
      fontSize: 12,
    },
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
    [theme.breakpoints.down('xs')]: {
      maxHeight: 260,
      fontSize: 12,
    },
  },
  tncAgreement: {
    fontWeight: 'bold',
    color: theme.palette.error.main,
    [theme.breakpoints.down('xs')]: {
      fontSize: 12,
    },
  },
  langBtn: {
    marginLeft: theme.padding.xs.px,
    padding: `0px ${theme.padding.unit.px}`,
    border: theme.border,
    borderRadius: theme.borderRadius,
    [theme.breakpoints.down('xs')]: {
      fontSize: 12,
    },
  },
});

export default styles;
