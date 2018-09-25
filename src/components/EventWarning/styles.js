import { EventWarningType } from 'constants';

const styles = (theme) => ({
  warningWrapper: {
    borderRadius: theme.borderRadius,
    padding: `${theme.padding.unit.px} ${theme.padding.sm.px}`,
    marginBottom: theme.padding.sm.px,
    [theme.breakpoints.down('xs')]: {
      margin: 0,
    },
  },
  [EventWarningType.INFO]: {
    background: theme.palette.primary.light,
    border: `solid 1px ${theme.palette.primary.main}`,
  },
  [EventWarningType.ERROR]: {
    background: theme.palette.error.light,
    border: `solid 1px ${theme.palette.error.main}`,
  },
  [EventWarningType.HIGHLIGHT]: {
    background: theme.palette.secondary.light,
    border: `solid 1px ${theme.palette.secondary.main}`,
  },
  pending: {
    background: '#E9FEFE',
    border: 'solid 1px #23DAE0',
  },
  upcoming: {
    background: '#F5A6231A',
    border: 'solid 1px #F5A623',
  },
});

export default styles;
