/* eslint-disable no-unused-vars */
import { createMuiTheme } from '@material-ui/core';

// Font
const fontLato = 'Lato, Helvetica, Arial, sans-serif';

// Type scale
const xxxSmallText = 10;
const xxSmallText = 12;
const xSmallText = 14;
const smallText = 16;
const mediumText = 20;
const largeText = 24;
const xLargeText = 32;
const xxLargeText = 48;

// Font weight
const fontWeightBold = 700;
const fontWeightMedium = 700;
const fontWeightRegular = 400;
const fontWeightLight = 300;

// Line height
const lineHeightLg = '150%';
const lineHeightSm = '125%';
const lineHeight32 = '32px';

// Brand Colors
const primaryBrandColor = '#585afa';
const secondaryBrandColor = '#23dae0';

// Brand Color variables
const primaryBrandColor200 = '#4648C1';
const primaryBrandColor80 = '#7A7AF3';
const primaryBrandColor60 = '#9B9CF5';
const primaryBrandColor30 = '#CDCEFA';
const secondaryBrandColor200 = '#52ACB1';
const secondaryBrandColor80 = '#7BDEE4';
const secondaryBrandColor60 = '#97E6EA';
const secondaryBrandColor30 = '#C8F2F5';

// Text Colors
const textColorDarkGrey = '#333333';
const textColorMediumGrey = '#666666';
const textColorLightGrey = '#b3b3b3';

// Background Color
const backgroundColorLight = '#f9f9f9';

// Support Colors
const supportColorRed100 = '#BE2828';
const supportColorRed60 = '#D36E78';
const supportColorRed30 = '#E8B6BC';
const supportColorBlue100 = '#3F7FD5';
const supportColorBlue60 = '#85B2E5';
const supportColorBlue30 = '#C1D8F2';
const supportColorGreen100 = '#7EC660';
const supportColorGreen60 = '#AFDC9D';
const supportColorGreen30 = '#D7EECE';
const supportColorYellow100 = '#E9AA44';
const supportColorYellow60 = '#F1CB86';
const supportColorYellow30 = '#F8E5C1';

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
    fontSize: px(xSmallText),
    fontWeightLight,
    fontWeightRegular,
    fontWeightMedium,
    fontWeightBold, // additional var
    h1: {
      fontSize: px(xxLargeText),
      fontWeight: fontWeightRegular,
      lineHeight: lineHeightSm,
      marginLeft: '0',
      color: textColorDarkGrey,
    },
    h5: {
      fontSize: px(xLargeText),
      fontWeight: fontWeightRegular,
      lineHeight: lineHeightLg,
      marginLeft: '0',
      color: textColorDarkGrey,
    },
    // large text (i.e. title on prediction title)
    h6: {
      fontSize: px(largeText),
      fontWeight: fontWeightBold,
      lineHeight: lineHeightSm,
      color: textColorDarkGrey,
    },
    body2: {
      fontSize: px(xSmallText),
      fontWeight: fontWeightRegular,
      lineHeight: lineHeightLg,
      color: textColorMediumGrey,
    },
    body1: {
      fontSize: px(smallText),
      fontWeight: fontWeightRegular,
      lineHeight: lineHeightLg,
      color: textColorMediumGrey,
    },
    caption: {
      fontSize: px(xxSmallText),
      fontWeight: fontWeightBold,
      lineHeight: lineHeightSm,
      color: textColorLightGrey,
    },
    micro: {
      fontSize: px(xxxSmallText),
      fontWeight: fontWeightBold,
      lineHeight: lineHeightSm,
      color: textColorLightGrey,
    },
    label: {
      fontSize: px(xxSmallText),
      fontWeight: fontWeightRegular,
      lineHeight: lineHeightLg,
    },
    link: {
      fontSize: px(xSmallText),
      fontWeight: fontWeightBold,
      lineHeight: lineHeightLg,
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
        fontSize: px(xxSmallText),
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
        fontSize: px(xxSmallText),
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
      xxLarge: {
        px: px(xxLargeText),
        rem: rem(xxLargeText),
      },
      xLarge: {
        px: px(xLargeText),
        rem: rem(xLargeText),
      },
      large: {
        px: px(largeText),
        rem: rem(largeText),
      },
      medium: {
        px: px(mediumText),
        rem: rem(mediumText),
      },
      small: {
        px: px(smallText),
        rem: rem(smallText),
      },
      xSmall: {
        px: px(xSmallText),
        rem: rem(xSmallText),
      },
      xxSmall: {
        px: px(xxSmallText),
        rem: rem(xxSmallText),
      },
      xxxSmall: {
        px: px(xxxSmallText),
        rem: rem(xxxSmallText),
      },
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
  subtitle1: {
    fontSize: px(mediumText),
    fontWeight: fontWeightBold,
    lineHeight: lineHeightSm,
    marginLeft: '0',
    color: textColorDarkGrey,
    [bodhiTheme.breakpoints.down('xs')]: {
      fontSize: px(largeText),
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
        fontSize: px(xxSmallText),
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
      fontSize: px(mediumText),
      fontWeight: fontWeightBold,
      minHeight: 56,
    },
    sizeSmall: {
      fontSize: px(xxSmallText),
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
        fontSize: px(xxSmallText),
      },
    },
    caption: {
      [bodhiTheme.breakpoints.down('xs')]: {
        fontSize: px(xxSmallText),
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
      fontSize: px(xxSmallText),
      paddingTop: px(space3X),
      paddingBottom: px(space3X),
      [bodhiTheme.breakpoints.down('md')]: {
        padding: px(spaceX),
      },
    },
    head: {
      fontWeight: fontWeightBold,
      fontSize: px(xxSmallText),
      [bodhiTheme.breakpoints.down('md')]: {
        padding: px(spaceX),
        fontSize: px(xxSmallText),
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
