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

// Brand Colors
const primaryBrandColor = '#585afa';
const secondaryBrandColor = '#23dae0';

// Brand Color variables
const primaryBrandColor200 = '#4648c8';
const primaryBrandColor80 = '#797bfb';
const primaryBrandColor60 = '#9b9cfc';
const primaryBrandColor30 = '#cdcefe';
const secondaryBrandColor200 = '#1caeb3';
const secondaryBrandColor80 = '#4fe1e6';
const secondaryBrandColor60 = '#7be9ec';
const secondaryBrandColor30 = '#bdf4f6';

// Text Colors
const textColorDarkGrey = '#333333';
const textColorMediumGrey = '#666666';
const textColorLightGrey = '#b3b3b3';

// Background Color
const backgroundColorLight = '#f9f9f9';

// Support Colors
const supportColorRed100 = '#d0021b';
const supportColorRed60 = '#e36776';
const supportColorRed30 = '#f1b3bb';
const supportColorBlue100 = '#1e81dc';
const supportColorBlue60 = '#78b3ea';
const supportColorBlue30 = '#bbd9f5';
const supportColorGreen100 = '#64c850';
const supportColorGreen60 = '#a2de96';
const supportColorGreen30 = '#d1efcb';
const supportColorYellow100 = '#f5a623';
const supportColorYellow60 = '#f9ca7b';
const supportColorYellow30 = '#fce4bd';

// White
const white = '#FFFFFF';

// Border
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
      light: primaryBrandColor30,
      main: primaryBrandColor,
      dark: primaryBrandColor200,
      contrastText: white,
    },
    secondary: {
      light: secondaryBrandColor30,
      main: secondaryBrandColor,
      dark: secondaryBrandColor200,
      contrastText: white,
    },
    error: {
      light: supportColorRed30,
      main: supportColorRed60,
      dark: supportColorRed100,
      contrastText: white,
    },
    background: {
      paper: white,
      default: backgroundColorLight,
      grey: borderColor, // additional var
    },
    text: {
      primary: textColorDarkGrey,
      secondary: textColorMediumGrey,
      disabled: textColorLightGrey,
      hint: textColorLightGrey,
    },
    extra: {
      orange: supportColorYellow100,
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
    h5: {
      fontSize: px(fontSizeTitleSm),
      fontWeight: fontWeightRegular,
      lineHeight: lineHeightLg,
      marginLeft: '0',
      color: textColorDarkGrey,
    },
    // large text (i.e. title on prediction title)
    h6: {
      fontSize: px(fontSizeTextMd),
      fontWeight: fontWeightBold,
      lineHeight: lineHeightLg,
      color: textColorDarkGrey,
    },
    body2: {
      fontSize: px(fontSizeMeta),
      fontWeight: fontWeightRegular,
      lineHeight: lineHeightLg,
      color: textColorMediumGrey,
    },
    body1: {
      fontSize: px(fontSizeTextSm),
      fontWeight: fontWeightRegular,
      lineHeight: lineHeightLg,
      color: textColorMediumGrey,
    },
    caption: {
      fontSize: px(fontSizeMeta),
      color: textColorLightGrey,
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
        backgroundColor: primaryBrandColor,
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
          backgroundColor: primaryBrandColor,
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
    color: textColorDarkGrey,
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
      backgroundColor: primaryBrandColor,
      color: white,
      boxShadow: '0px 0px 2px rgba(0, 0, 0, .5)',
      '&:hover': {
        backgroundColor: primaryBrandColor,
        boxShadow: '0px 0px 10px rgba(0, 0, 0, .25)',
      },
      '&:disabled': {
        backgroundColor: primaryBrandColor,
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
      color: textColorMediumGrey,
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
