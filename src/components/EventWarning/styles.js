import { EventWarningType } from '../../constants';

const styles = (theme) => ({
  warningWrapper: {
    background: theme.palette.primary.light,
    border: `solid 1px ${theme.palette.primary.main}`,
    borderRadius: theme.borderRadius,
    overflow: 'hidden',
    padding: `${theme.padding.unit.px} ${theme.padding.xs.px}`,
    marginBottom: theme.padding.sm.px,
    [`&.${EventWarningType.Error}`]: {
      background: theme.palette.error.light,
      border: `solid 1px ${theme.palette.error.main}`,
    },
    [`&.${EventWarningType.Highlight}`]: {
      background: theme.palette.secondary.light,
      border: `solid 1px ${theme.palette.secondary.main}`,
    },
  },
});

export default styles;
