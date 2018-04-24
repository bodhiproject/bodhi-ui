import { EventWarningType } from '../../constants';


const styles = (theme) => ({
  warning: {
    color: theme.palette.primary.main,
    fontSize: theme.sizes.font.meta,
    [`&.${EventWarningType.Error}`]: {
      color: theme.palette.error.main,
    },
    [`&.${EventWarningType.Highlight}`]: {
      color: theme.palette.secondary.main,
    },
  },
});

export default styles;
