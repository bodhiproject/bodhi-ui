import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import SearchIcon from 'material-ui-icons/Search';
import Input, { InputLabel, InputAdornment } from 'material-ui/Input';

const styles = (theme) => ({
  root: {
    width: '100%',
    background: '#ffffff',
    borderRadius: 8,
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 16,
    paddingRight: 16,
    fontSize: 14,
  },
});

class SearchField extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
    };
  }

  render() {
    const { classes } = this.props;
    const { searchQuery } = this.state;

    return (
      <div>
        <Input
          className={classes.root}
          id="searchField"
          placeholder="Search"
          startAdornment={<InputAdornment position="start"><SearchIcon /></InputAdornment>}
          disableUnderline
        />
      </div>
    );
  }
}

SearchField.propTypes = {
  classes: PropTypes.object.isRequired,
};

SearchField.defaultProps = {
};

export default withStyles(styles)(SearchField);
