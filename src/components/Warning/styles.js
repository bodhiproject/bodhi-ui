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
    color: '#23DAE0',
    fontSize: theme.sizes.font.meta,
  },
  upcoming: {
    fontFamily: 'Lato',
    fontWeight: 'bold',
    color: '#F5A623',
  },
});

export default styles;
