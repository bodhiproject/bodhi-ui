import React, { Component } from 'react';
import { connect } from 'react-redux';
import ecommerceActions from '../../redux/ecommerce/actions';
import { Hits, Pagination, SortBy, Stats } from 'react-instantsearch/dom';
import Hit from './hit';
import {
  ContentWrapper,
  TopbarWrapper,
  PaginationStyleWrapper,
} from './algoliaComponent.style';

const { changeView } = ecommerceActions;

class Content extends Component {
  render() {
    const { view } = this.props;
    return (
      <ContentWrapper className="isoAlgoliaContentWrapper">
        <TopbarWrapper className="isoAlgoliaTopBar">
          <Stats />
          <SortBy
            defaultRefinement="default_search"
            items={[
              { value: 'default_search', label: 'Default' },
              { value: 'price_asc', label: 'Lowest Price' },
              { value: 'price_desc', label: 'Highest Price' },
            ]}
          />
          <div className="isoViewChanger">
            <button
              type="button"
              className={
                view === 'gridView' ? 'isoGridView active' : 'isoGridView'
              }
              onClick={() => this.props.changeView('gridView')}
            >
              <i className="ion-grid" />
            </button>
            <button
              type="button"
              className={
                view === 'gridView' ? 'isoListView' : 'isoListView active'
              }
              onClick={() => this.props.changeView('listView')}
            >
              <i className="ion-navicon-round" />
            </button>
          </div>
        </TopbarWrapper>
        <Hits hitComponent={Hit} />

        <PaginationStyleWrapper className="isoAlgoliaPagination">
          <Pagination showLast />
        </PaginationStyleWrapper>
      </ContentWrapper>
    );
  }
}
function mapStateToProps(state) {
  return {
    view: state.Ecommerce.toJS().view,
  };
}
export default connect(mapStateToProps, { changeView })(Content);
