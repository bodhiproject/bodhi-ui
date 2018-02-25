import { createMuiTheme } from 'material-ui/styles';

/* Brand Variables */

const fontLato = 'Lato, Helvetica, Arial, sans-serif';

const fontSizeTitleLg = 36;
const fontSizeTitleSm = 24;
const fontSizeTextLg = 20;
const fontSizeTextSm = 16;
const fontSizeMeta = 14;

const lineHeightLg = '133.33%';
const lineHeightSm = '125%';

const white = '#FFFFFF';

// neon blue
const primaryColor = '#585AFA';
const primaryColorLight = '#C4C5FD';
const primaryColorDark = '#4244BB';

// neo teal
const secondaryColor = '#22F5F2';
const secondaryColorLight = '#23DAE0';
const secondaryColorDark = '#11A5A9';

const textColorDark = '#333333';
const textColorGrey = '#666666';
const textColorLight = '#9B9B9B';

const backgroundColor = '#F9F9F9';
const borderColor = '#ECECEC';
const borderRadius = 4;

const spaceUnit = 8;
const paddingXs = spaceUnit * 2;
const paddingSm = spaceUnit * 3;
const paddingMd = spaceUnit * 5;
const paddingLg = spaceUnit * 7;

const px = function (value) {
  return value.toString().concat('px');
};

// Material Theme for Bodhi

const bodhiTheme = createMuiTheme({
  /* material variables */
  palette: {
    primary: {
      light: primaryColorLight,
      main: primaryColor,
      dark: primaryColorDark,
      contrastText: white,
    },
    secondary: {
      light: secondaryColorLight,
      main: secondaryColor,
      dark: secondaryColorDark,
      contrastText: white,
    },
    background: {
      paper: white,
      default: backgroundColor,
    },
    divider: borderColor,
  },
  typography: {
    fontFamily: fontLato,
    fontSize: fontSizeTextSm,
    // large title (i.e. title on prediction title)
    display1: {
      fontSize: px(fontSizeTitleLg),
      fontWeight: 400,
      lineHeight: lineHeightLg,
      marginLeft: '0',
      color: textColorDark,
    },
  },
  /* override component */
  overrides: {
    MuiPaper: {
      root: {
        boxShadow: 'none !important',
        borderRadius: px(borderRadius),
      },
    },
  },
  /* additional variables */
  padding: {
    xs: {
      value: paddingXs,
      px: px(paddingXs),
    },
    sm: {
      value: paddingSm,
      px: px(paddingSm),
    },
    md: {
      value: paddingMd,
      px: px(paddingMd),
    },
    lg: {
      value: paddingLg,
      px: px(paddingLg),
    },
  },
  border: 'solid 1px '.concat(borderColor),
});

export default bodhiTheme;
