import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Input, Icon } from 'antd';

const { Search } = Input;

const styles = {
  root: {
    width: '100%',
    height: 40,
    fontSize: 14,
  },
};

class SearchField extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
    };
  }

  render() {
    return (
      <Search
        id="searchField"
        size="large"
        placeholder="Search"
        onSearch={(value) => console.log(value)}
        style={styles.root}
      />
    );
  }
}

SearchField.propTypes = {
};

SearchField.defaultProps = {
};

export default SearchField;
