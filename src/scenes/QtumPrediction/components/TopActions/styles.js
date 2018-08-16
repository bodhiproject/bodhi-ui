const styles = (theme) => ({
  dashboardActionsWrapper: {
    marginBottom: theme.padding.sm.px,
  },
  createEventButton: {
    padding: `12px ${theme.padding.sm.px}`,
    verticalAlign: 'middle',
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
  sportCreateIcon: {}, // TODO: remove after world cup
});

export default styles;
