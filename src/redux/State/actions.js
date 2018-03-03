const stateActions = {
  EDITING_TOGGLED: 'EDITING_TOGGLED',
  editingToggled: () => ({
    type: stateActions.EDITING_TOGGLED,
  }),

  CLEAR_EDITING_TOGGLED: 'CLEAR_EDITING_TOGGLED',
  clearEditingToggled: () => ({
    type: stateActions.CLEAR_EDITING_TOGGLED,
  }),
};

export default stateActions;
