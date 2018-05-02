import { EventWarningType } from '../../constants';


const styles = (theme) => ({
  [EventWarningType.Info]: {
    color: theme.palette.primary.main,
    fontSize: theme.sizes.font.meta,
  },
  [EventWarningType.Error]: {
    color: theme.palette.error.main,
    fontSize: theme.sizes.font.meta,
  },
  [EventWarningType.Highlight]: {
    color: theme.palette.secondary.main,
    fontSize: theme.sizes.font.meta,
  },
  pending: {
    color: '#23DAE0',
    fontSize: theme.sizes.font.meta,
  },
});

export default styles;
