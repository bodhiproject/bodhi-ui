import { EventWarningType } from 'constants';


const styles = (theme) => ({
  [EventWarningType.INFO]: {
    color: theme.palette.primary.main,
    fontSize: theme.sizes.font.xxSmall.rem,
  },
  [EventWarningType.ERROR]: {
    color: theme.palette.error.main,
    fontSize: theme.sizes.font.xxSmall.rem,
  },
  [EventWarningType.HIGHLIGHT]: {
    color: theme.palette.secondary.main,
    fontSize: theme.sizes.font.xxSmall.rem,
  },
  [EventWarningType.ORANGE]: {
    fontWeight: theme.typography.fontWeightBold,
    color: theme.palette.extra.orange,
  },
});

export default styles;
