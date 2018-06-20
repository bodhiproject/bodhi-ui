import React from 'react';
import { injectIntl } from 'react-intl';
import { withStyles } from 'material-ui';
import styles from './styles';


const Loading = injectIntl(({ classes, text, intl, ...props }) => <Col><div className={classes.loading} {...props} />{intl.formatMessage({ id: text })}</Col>);

const Col = withStyles(styles)(({ classes, ...props }) => <div className={classes.col} {...props} />);

export default withStyles(styles, { withTheme: true })(Loading);
