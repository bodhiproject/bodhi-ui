const styles = (theme) => ({
  dashboardActionsWrapper: {
    marginBottom: theme.padding.sm.px,
  },
  createEventButton: {
    padding: `12px ${theme.padding.sm.px}`,
    verticalAlign: 'middle',
  },
  createEventIcon: {
    marginRight: theme.padding.unit.px,
  },
  dashboardActionsRight: {
    textAlign: 'right',
  },
  dashboardActionsSort: {
    display: 'inline-block',
    padding: `${theme.padding.unit.px} ${theme.padding.sm.px}`,
    verticalAlign: 'middle',
  },
  dashboardActionsSortLabel: {
    marginRight: theme.padding.sm.px,
  },
});

export default styles;
