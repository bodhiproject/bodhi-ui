import { createMuiTheme } from 'material-ui/styles';

/* Brand Variables */

const fontLato = 'Lato, Helvetica, Arial, sans-serif';

// TODO (LIV): TOO MANY FONT SIZES, TALK TO THE DESIGNERS
const fontSizeTitleLg = 36;
const fontSizeTitleMd = 32;
const fontSizeTitleSm = 24;
const fontSizeTextLg = 20;
const fontSizeTextMd = 18;
const fontSizeTextSm = 16;
const fontSizeMeta = 14;

const lineHeightLg = '133.33%';
const lineHeightSm = '125%';

const progressHeight = 12;
const iconSize = 24;

const white = '#FFFFFF';

// neon blue
const primaryColor = '#585AFA';
const primaryColorDark = '#4244BB';

// neo teal
const secondaryColor = '#23DAE0';
const secondaryColorLight = '#22F5F2';
const secondaryColorDark = '#11A5A9';

const textColorDark = '#333333';
const textColorGrey = '#666666';
const textColorLight = '#9B9B9B';

const backgroundColor = '#F9F9F9';
const borderColor = '#ECECEC';
const borderRadius = 4;

const spaceUnit = 8;
const paddingXs = spaceUnit * 2; // 16
const paddingSm = spaceUnit * 3; // 24
const paddingMd = spaceUnit * 5; // 40
const paddingLg = spaceUnit * 7; // 56

const navHeight = 70;

const px = function (value) {
  return value.toString().concat('px');
};

// Material Theme for Bodhi

const bodhiTheme = createMuiTheme({
  /* material variables */
  palette: {
    primary: {
      light: primaryColor,
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
      grey: borderColor, // additional var
    },
    text: {
      primary: textColorDark,
      secondary: textColorGrey,
      disabled: textColorLight,
      hint: textColorLight,
    },
    divider: borderColor,
  },
  typography: {
    fontFamily: fontLato,
    fontSize: fontSizeTextSm,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 700,
    fontWeightBold: 700, // additional var
    // large headline (i.e. title on prediction title)
    display1: {
      fontSize: px(fontSizeTitleLg),
      fontWeight: 400,
      lineHeight: lineHeightLg,
      marginLeft: '0',
      color: textColorDark,
    },
    headline: {
      fontSize: px(fontSizeTitleSm),
      fontWeight: 400,
      lineHeight: lineHeightLg,
      marginLeft: '0',
      color: textColorDark,
    },
    // large text (i.e. title on prediction title)
    title: {
      fontSize: px(fontSizeTextMd),
      fontWeight: 700,
      lineHeight: lineHeightLg,
      color: textColorDark,
    },
    body1: {
      fontSize: px(fontSizeMeta),
      fontWeight: 400,
      lineHeight: lineHeightLg,
      color: textColorGrey,
    },
    body2: {
      fontSize: px(fontSizeTextSm),
      fontWeight: 400,
      lineHeight: lineHeightLg,
      color: textColorGrey,
    },
  },
  /* override component globally */
  overrides: {
    MuiLinearProgress: {
      root: {
        height: px(progressHeight),
        borderRadius: px(progressHeight),
        backgroundColor: borderColor.concat(' !important'),
      },
    },
    MuiSelect: {
      select: {
        '&:focus': {
          backgroundColor: 'transparent',
        },
      },
    },
    MuiButton: {
      root: {
        borderRadius: px(paddingLg),
        textTransform: 'none',
      },
      sizeLarge: {
        fontSize: px(fontSizeTextLg),
        fontWeight: 700,
        minHeight: px(paddingLg),
      },
    },
    // TODO (LIVIA): USE A VARIENT INSTEAD OF OVERRIDE
    MuiStepConnector: {
      vertical: {
        padding: '0',
      },
      lineVertical: {
        minHeight: '40px',
      },
    },
    MuiDialogContentText: {
      root: {
        wordWrap: 'break-word',
      },
    },
    MuiTab: {
      root: {
        marginTop: px(spaceUnit),
        marginBottom: px(spaceUnit),
      },
      label: {
        fontSize: fontSizeTextSm,
        textTransform: 'none !important',
      },
    },
  },
  /* additional variables */
  padding: {
    unit: {
      value: spaceUnit,
      px: px(spaceUnit),
    },
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
  sizes: {
    icon: px(iconSize),
    font: {
      titleLg: px(fontSizeTitleLg),
      titleMd: px(fontSizeTitleMd),
      titleSm: px(fontSizeTitleSm),
      textLg: px(fontSizeTextLg),
      textMd: px(fontSizeTextMd),
      textSm: px(fontSizeTextSm),
      meta: px(fontSizeMeta),
    },
    table: {
      minWidth: 1316, // TODO: Adjust accordingly once full screen width logic is implemented
      headerHeight: 40,
    },
    navHeight: px(navHeight),
  },
  border: 'solid 1px '.concat(borderColor),
  borderRadius: px(borderRadius),
});

export default bodhiTheme;
