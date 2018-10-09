/* eslint-disable no-unused-vars */
import { createMuiTheme } from '@material-ui/core';

// Font
const fontLato = 'Lato, Helvetica, Arial, sans-serif';

// Font size
const fontSizeTitleLg = 36;
const fontSizeTitleMd = 32;
const fontSizeTitleSm = 24;
const fontSizeTextLg = 20;
const fontSizeTextMd = 18;
const fontSizeTextSm = 16;
const fontSizeMeta = 14;

// Font weight
const fontWeightBold = 700;
const fontWeightMedium = 700;
const fontWeightRegular = 400;
const fontWeightLight = 300;

// Line height
const lineHeightLg = '133.33%';
const lineHeightSm = '125%';
const lineHeight32 = '32px';

// Neon blue
const primaryColor = '#585AFA';
const primaryColorDark = '#4244BB';
const primaryColorLight = '#F0F0FF';

// Neo teal
const secondaryColor = '#23DAE0';
const secondaryColorLight = '#E9FEFE';
const secondaryColorDark = '#11A5A9';

// White
const white = '#FFFFFF';

// Red
const redColor = '#FE4A49';
const redColorLight = '#FFDEDE';
const redColorDark = '#960F0E';

// Orange
const orange = '#F5A623';

// Text
const textColorDark = '#333333';
const textColorGrey = '#666666';
const textColorLight = '#9B9B9B';

// Misc
const backgroundColor = '#F9F9F9';
const borderColor = '#ECECEC';
const borderColorDark = '#999999';

// Spacing
const paddingUnit = 8;
const paddingXs = paddingUnit * 2; // 16
const paddingSm = paddingUnit * 3; // 24
const paddingMd = paddingUnit * 5; // 40
const paddingLg = paddingUnit * 7; // 56

// Size
const progressHeight = 12;
const iconSizeLg = 24;
const iconSizeSm = 18;
const borderRadius = 4;
const navHeight = 70;
const footerHeight = '34.48px';
const tableHeaderHeight = 40;

const px = (value) => value.toString().concat('px');

export const theme = {
  /* Material variables */
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
    extra: {
      orange,
    },
    divider: borderColor,
  },
  typography: {
    fontFamily: fontLato,
    fontSize: fontSizeTextSm,
    fontWeightLight,
    fontWeightRegular,
    fontWeightMedium,
    fontWeightBold, // additional var
    headline: {
      fontSize: px(fontSizeTitleSm),
      fontWeight: fontWeightRegular,
      lineHeight: lineHeightLg,
      marginLeft: '0',
      color: textColorDark,
    },
    // large text (i.e. title on prediction title)
    title: {
      fontSize: px(fontSizeTextMd),
      fontWeight: fontWeightBold,
      lineHeight: lineHeightLg,
      color: textColorDark,
    },
    body1: {
      fontSize: px(fontSizeMeta),
      fontWeight: fontWeightRegular,
      lineHeight: lineHeightLg,
      color: textColorGrey,
    },
    body2: {
      fontSize: px(fontSizeTextSm),
      fontWeight: fontWeightRegular,
      lineHeight: lineHeightLg,
      color: textColorGrey,
    },
    caption: {
      fontSize: px(fontSizeMeta),
      color: textColorLight,
    },
  },
  /* Component overrides */
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
        boxSizing: 'border-box',
        borderBottom: `2px solid ${borderColor}`,
        background: white,
      },
    },
    MuiTab: {
      root: {
        marginTop: px(paddingUnit),
        marginBottom: px(paddingUnit),
        borderCollapse: 'separate',
      },
      label: {
        fontSize: fontSizeTextSm,
        textTransform: 'none !important',
      },
    },
    MuiTable: {
      root: {
        background: white,
        borderTop: `1px solid ${borderColor}`,
      },
    },
    MuiTableRow: {
      head: {
        height: tableHeaderHeight,
        background: borderColor,
      },
    },
    MuiTooltip: {
      tooltip: {
        backgroundColor: primaryColor,
        color: white,
        fontSize: px(fontSizeMeta),
        padding: paddingUnit,
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
  /* User-defined */
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
    icon: {
      large: px(iconSizeLg),
      small: px(iconSizeSm),
    },
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

const bodhiTheme = createMuiTheme(theme);

bodhiTheme.typography = {
  ...bodhiTheme.typography,
  // large headline (i.e. title on prediction title)
  display1: {
    fontSize: px(fontSizeTitleLg),
    fontWeight: fontWeightRegular,
    lineHeight: lineHeightLg,
    marginLeft: '0',
    color: textColorDark,
    [bodhiTheme.breakpoints.down('xs')]: {
      fontSize: fontSizeTitleSm,
      fontWeight: fontWeightBold,
      lineHeight: lineHeight32,
    },
  },
};

bodhiTheme.overrides = {
  ...bodhiTheme.overrides,
  MuiButton: {
    root: {
      borderRadius: px(paddingLg),
      textTransform: 'none',
      [bodhiTheme.breakpoints.down('xs')]: {
        padding: px(paddingUnit),
        minWidth: 64,
        minHeight: 32,
        fontSize: 12,
      },
    },
    raisedPrimary: {
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
      fontWeight: fontWeightBold,
      minHeight: 56,
    },
    sizeSmall: {
      fontSize: px(fontSizeMeta),
      fontWeight: fontWeightBold,
      height: 40,
      padding: `0 ${paddingSm}`,
    },
  },
  MuiTablePagination: {
    toolbar: {
      [bodhiTheme.breakpoints.down('xs')]: {
        paddingLeft: px(paddingUnit),
      },
    },
    selectRoot: {
      [bodhiTheme.breakpoints.down('xs')]: {
        margin: 0,
        fontSize: 12,
      },
    },
    caption: {
      [bodhiTheme.breakpoints.down('xs')]: {
        fontSize: 12,
      },
    },
    actions: {
      [bodhiTheme.breakpoints.down('xs')]: {
        marginLeft: 0,
      },
    },
  },
  MuiTableCell: {
    body: {
      color: textColorGrey,
      fontSize: 13,
      paddingTop: px(paddingSm),
      paddingBottom: px(paddingSm),
      [bodhiTheme.breakpoints.down('md')]: {
        padding: px(paddingUnit),
        fontSize: 12,
      },
    },
    head: {
      fontWeight: fontWeightBold,
      fontSize: px(fontSizeMeta),
      [bodhiTheme.breakpoints.down('md')]: {
        padding: px(paddingUnit),
        fontSize: 12,
      },
    },
    numeric: {
      [bodhiTheme.breakpoints.down('md')]: {
        padding: px(paddingUnit),
      },
    },
  },
};

export default bodhiTheme;
