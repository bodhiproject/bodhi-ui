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
const baseSpaceX = 8;
const spaceX = baseSpaceX; // 8
const space2X = baseSpaceX * 2; // 16
const space3X = baseSpaceX * 3; // 24
const space4X = baseSpaceX * 4; // 32
const space5X = baseSpaceX * 5; // 40
const space6X = baseSpaceX * 6; // 48
const space7X = baseSpaceX * 7; // 56
const space8X = baseSpaceX * 8; // 64
const space9X = baseSpaceX * 9; // 72
const space10X = baseSpaceX * 10; // 80
const space11X = baseSpaceX * 11; // 88
const space12X = baseSpaceX * 12; // 96

// Size
const progressHeight = 12;
const iconSizeLg = 24;
const iconSizeSm = 18;
const borderRadius = 4;
const navHeight = 70;
const footerHeight = '34.48px';
const tableHeaderHeight = 40;

const px = (value) => value.toString().concat('px');
const rem = (value) => (value / 16).toString().concat('rem');

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
    useNextVariants: true,
    fontFamily: fontLato,
    fontSize: fontSizeTextSm,
    fontWeightLight,
    fontWeightRegular,
    fontWeightMedium,
    fontWeightBold, // additional var
    h1: {
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
        marginTop: px(spaceX),
        marginBottom: px(spaceX),
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
        padding: spaceX,
      },
    },
    MuiExpansionPanelSummary: {
      expandIcon: {
        top: px(space3X),
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
    spaceX: {
      value: spaceX,
      px: px(spaceX),
      rem: rem(spaceX),
    },
    space2X: {
      value: space2X,
      px: px(space2X),
      rem: rem(space2X),
    },
    space3X: {
      value: space3X,
      px: px(space3X),
      rem: rem(space3X),
    },
    space4X: {
      value: space4X,
      px: px(space4X),
      rem: rem(space4X),
    },
    space5X: {
      value: space5X,
      px: px(space5X),
      rem: rem(space5X),
    },
    space6X: {
      value: space6X,
      px: px(space6X),
      rem: rem(space6X),
    },
    space7X: {
      value: space7X,
      px: px(space7X),
      rem: rem(space7X),
    },
    space8X: {
      value: space8X,
      px: px(space8X),
      rem: rem(space8X),
    },
    space9X: {
      value: space9X,
      px: px(space9X),
      rem: rem(space9X),
    },
    space10X: {
      value: space10X,
      px: px(space10X),
      rem: rem(space10X),
    },
    space11X: {
      value: space11X,
      px: px(space11X),
      rem: rem(space11X),
    },
    space12X: {
      value: space12X,
      px: px(space12X),
      rem: rem(space12X),
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
    navHeight: {
      value: navHeight,
      px: px(navHeight),
    },
    footerHeight,
  },
  border: `solid 1px ${borderColor}`,
  borderRadius: px(borderRadius),
};

const bodhiTheme = createMuiTheme(theme);

bodhiTheme.typography = {
  ...bodhiTheme.typography,
  // large headline (i.e. title on prediction title)
  subtitle2: {
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
      borderRadius: px(space7X),
      textTransform: 'none',
      [bodhiTheme.breakpoints.down('xs')]: {
        padding: px(spaceX),
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
      padding: `0 ${space3X}`,
    },
  },
  MuiTablePagination: {
    toolbar: {
      [bodhiTheme.breakpoints.down('xs')]: {
        paddingLeft: px(spaceX),
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
      paddingTop: px(space3X),
      paddingBottom: px(space3X),
      [bodhiTheme.breakpoints.down('md')]: {
        padding: px(spaceX),
        fontSize: 12,
      },
    },
    head: {
      fontWeight: fontWeightBold,
      fontSize: px(fontSizeMeta),
      [bodhiTheme.breakpoints.down('md')]: {
        padding: px(spaceX),
        fontSize: 12,
      },
    },
    numeric: {
      [bodhiTheme.breakpoints.down('md')]: {
        padding: px(spaceX),
      },
    },
  },
};

export default bodhiTheme;
