import { EventWarningType } from 'constants';


const styles = (theme) => ({
  [EventWarningType.INFO]: {
    color: theme.palette.primary.main,
    fontSize: theme.sizes.font.meta,
  },
  [EventWarningType.ERROR]: {
    color: theme.palette.error.main,
    fontSize: theme.sizes.font.meta,
  },
  [EventWarningType.HIGHLIGHT]: {
    color: theme.palette.secondary.main,
    fontSize: theme.sizes.font.meta,
  },
  pending: {
    color: theme.palette.secondary.main,
    fontSize: theme.sizes.font.meta,
  },
  upcoming: {
    fontWeight: theme.typography.fontWeightBold,
    color: theme.palette.extra.orange,
  },
});

export default styles;
