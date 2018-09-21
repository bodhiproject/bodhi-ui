import React, { Component, Fragment } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router';
import {
  withStyles,
} from '@material-ui/core';
import { FavoriteBorder, Favorite } from '@material-ui/icons';

import styles from './styles';

@withStyles(styles, { withTheme: true })
@withRouter
@inject('store')
@observer
class FavoriteButton extends Component {
  state = {
    isFavorite: false,
  }

  componentDidMount() {
    // Oracle.topicAddress or Topic.address. May changes once Topic got renewal with MobX.
    const topicAddress = this.props.event.topicAddress || this.props.event.address;
    const updatedFavorite = this.props.store.favorite.isInFavorite(topicAddress);
    this.setState({ isFavorite: updatedFavorite });
  }

  handleClick = () => (event) => { // eslint-disable-line
    event.preventDefault();
    // Oracle.topicAddress or Topic.address. May changes once Topic got renewal with MobX.
    const topicAddress = this.props.event.topicAddress || this.props.event.address;
    this.props.store.favorite.setFavorite(topicAddress);
    const updatedFavorite = this.props.store.favorite.isInFavorite(topicAddress);
    this.setState({ isFavorite: updatedFavorite });
  }

  render() {
    const { isFavorite } = this.state; // eslint-disable-line
    const { store, event } = this.props;
    const topicAddress = event.topicAddress || event.address;

    return (
      <Fragment>
        <span onClick={this.handleClick()}>{store.favorite.isInFavorite(topicAddress) ? <Favorite color='error' /> : <FavoriteBorder />}</span>
      </Fragment>
    );
  }
}

export default FavoriteButton;
