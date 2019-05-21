import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { FavoriteBorder, Favorite } from '@material-ui/icons';

@inject('store')
@observer
export default class FavoriteButton extends Component {
  static propTypes = {
    eventAddress: PropTypes.string.isRequired,
  };

  handleClick = (event) => {
    event.preventDefault();

    const { eventAddress, store: { favorite } } = this.props;
    favorite.setFavorite(eventAddress);
  }

  render() {
    const { store: { favorite }, eventAddress } = this.props;
    return (
      <span onClick={this.handleClick}>
        {favorite.isFavorite(eventAddress)
          ? <Favorite color='error' />
          : <FavoriteBorder />
        }
      </span>
    );
  }
}
