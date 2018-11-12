import { EventWarningType } from 'constants';


const styles = (theme) => ({
  [EventWarningType.INFO]: {
    color: theme.palette.primary.main,
    fontSize: theme.sizes.font.xxSmall,
  },
  [EventWarningType.ERROR]: {
    color: theme.palette.error.main,
    fontSize: theme.sizes.font.xxSmall,
  },
  [EventWarningType.HIGHLIGHT]: {
    color: theme.palette.secondary.main,
    fontSize: theme.sizes.font.xxSmall,
  },
  [EventWarningType.ORANGE]: {
    fontWeight: theme.typography.fontWeightBold,
    color: theme.palette.extra.orange,
  },
});

export default styles;
