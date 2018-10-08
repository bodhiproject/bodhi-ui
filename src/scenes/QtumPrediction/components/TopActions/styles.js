const styles = (theme) => ({
  dashboardActionsWrapper: {
    marginBottom: theme.padding.sm.px,
  },
  createEventButton: {
    padding: `12px ${theme.padding.sm.px}`,
    verticalAlign: 'middle',
  },
  createEventButtonIcon: {
    [theme.breakpoints.down('xs')]: {
      fontSize: theme.sizes.font.textMd,
    },
  },
  dashboardActionsRight: {
    textAlign: 'right',
  },
  dashboardActionsSort: {
    display: 'inline-block',
    padding: `${theme.padding.unit.px} ${theme.padding.sm.px}`,
    verticalAlign: 'middle',
    [theme.breakpoints.down('xs')]: {
      padding: `${theme.padding.unit.px} ${theme.padding.unit.px}`,
    },
  },
  dashboardActionsSortLabel: {
    marginRight: theme.padding.sm.px,
    [theme.breakpoints.down('xs')]: {
      fontSize: 12,
      marginRight: theme.padding.unit.px,
    },
  },
  dashboardActionsSelect: {
    [theme.breakpoints.down('xs')]: {
      fontSize: 12,
    },
  },
  dashboardActionsMenuItem: {
    [theme.breakpoints.down('xs')]: {
      fontSize: 12,
    },
  },
});

export default styles;
