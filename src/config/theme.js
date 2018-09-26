/* eslint-disable no-unused-vars */
import { createMuiTheme } from '@material-ui/core';

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

// neon blue
const primaryColor = '#585AFA';
const primaryColorDark = '#4244BB';
const primaryColorLight = '#F0F0FF';

// neo teal
const secondaryColor = '#23DAE0';
const secondaryColorLight = '#E9FEFE';
const secondaryColorDark = '#11A5A9';

// white
const white = '#FFFFFF';

// red
const redColor = '#FE4A49';
const redColorLight = '#FFDEDE';
const redColorDark = '#960F0E';

const textColorDark = '#333333';
const textColorGrey = '#666666';
const textColorLight = '#9B9B9B';

const backgroundColor = '#F9F9F9';
const borderColor = '#ECECEC';
const borderRadius = 4;

const paddingUnit = 8;
const paddingXs = paddingUnit * 2; // 16
const paddingSm = paddingUnit * 3; // 24
const paddingMd = paddingUnit * 5; // 40
const paddingLg = paddingUnit * 7; // 56

const navHeight = 70;
const footerHeight = '34.48px';
const tableHeaderHeight = 40;

const px = (value) => value.toString().concat('px');

export const theme = {
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
    error: {
      light: redColorLight,
      main: redColor,
      dark: redColorDark,
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
    caption: {
      fontSize: px(fontSizeMeta),
      color: textColorLight,
    },
  },
  /* override component globally */
  overrides: {
    MuiLinearProgress: {
      root: {
        height: px(progressHeight),
        borderRadius: px(progressHeight),
        backgroundColor: `${borderColor} !important`,
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
      raised: {
        backgroundColor: primaryColor,
        color: white,
        boxShadow: '0px 0px 2px rgba(0, 0, 0, .5)',
        '&:hover': {
          backgroundColor: primaryColor,
          boxShadow: '0px 0px 10px rgba(0, 0, 0, .25)',
        },
        '&:disabled': {
          backgroundColor: primaryColor,
          color: white,
          opacity: 0.6,
        },
      },
      sizeLarge: {
        fontSize: px(fontSizeTextLg),
        fontWeight: 700,
        minHeight: px(paddingLg),
      },
    },
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
    MuiTabs: {
      root: {
        zIndex: 999,
      },
    },
    MuiTab: {
      root: {
        marginTop: px(paddingUnit),
        marginBottom: px(paddingUnit),
      },
      label: {
        fontSize: fontSizeTextSm,
        textTransform: 'none !important',
      },
    },
    MuiTable: {
      root: {
        background: white,
        border: `solid 1px ${borderColor}`,
      },
    },
    MuiTableRow: {
      head: {
        height: tableHeaderHeight,
        background: borderColor,
      },
    },
    MuiTableCell: {
      body: {
        color: textColorGrey,
        fontSize: 13,
      },
      head: {
        fontWeight: 700,
        fontSize: px(fontSizeMeta),
      },
    },
    MuiExpansionPanelSummary: {
      expandIcon: {
        top: px(paddingSm),
        right: 0,
      },
    },
    MuiExpansionPanel: {
      root: {
        '&:disabled': {
          backgroundColor: primaryColor,
          opacity: 0.1,
          boxShadow: '0px 0px 4px rgba(0, 0, 0, .2)',
        },
      },
    },
  },
  /* additional variables */
  padding: {
    unit: {
      value: paddingUnit,
      px: px(paddingUnit),
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
      headerHeight: tableHeaderHeight,
    },
    navHeight: px(navHeight),
    footerHeight,
  },
  border: `solid 1px ${borderColor}`,
  borderRadius: px(borderRadius),
};

export default createMuiTheme(theme);
/* eslint-enable no-unused-vars */
