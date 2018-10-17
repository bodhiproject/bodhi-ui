import { EventWarningType } from 'constants';

const styles = (theme) => ({
  warningWrapper: {
    borderRadius: theme.borderRadius,
    padding: theme.padding.spaceX.px,
    marginBottom: theme.padding.space3X.px,
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
  [EventWarningType.ORANGE]: {
    background: `${theme.palette.extra.orange}1A`,
    border: `solid 1px ${theme.palette.extra.orange}`,
  },
});

export default styles;
