import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { FormattedMessage, injectIntl } from 'react-intl';
import classNames from 'classnames';

import styles from './styles';

class ImportantNote extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    message: PropTypes.object,
  };

  static defaultProps = {
    message: undefined,
  };

  render() {
    const {
      classes,
    } = this.props;

    if (!message) {
      return null;
    }

    return (
      <div className={classNames(classes.warningWrapper)}>
        <i className={classNames(classes.infoIcon, 'icon', 'iconfont', 'icon-ic_info')}></i>
        {message}
      </div>
    );
  }
}

export default injectIntl(withStyles(styles, { withTheme: true })(ImportantNote));
