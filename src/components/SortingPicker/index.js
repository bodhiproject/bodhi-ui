
@injectIntl
@connect(null, (dispatch) => ({
  sortOrderChanged: (sortBy) => dispatch(dashboardActions.sortOrderChanged(sortBy)),
}))
export default class SortingPicker extends Component {