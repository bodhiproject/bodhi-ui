import React from 'react';
import PropTypes from 'prop-types';
import Dialog, { DialogActions, DialogContent, DialogTitle } from 'material-ui/Dialog';
import Grid from 'material-ui/Grid';
import TextField from 'material-ui/TextField';
import Input, { InputLabel, InputAdornment } from 'material-ui/Input';
import Select from 'material-ui/Select';
import Button from 'material-ui/Button';
import { MenuItem } from 'material-ui/Menu';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { FormattedMessage, injectIntl, intlShape, defineMessages } from 'react-intl';
import _ from 'lodash';
import moment from 'moment';
import Web3Utils from 'web3-utils';

import SelectAddressDialog from '../../components/SelectAddressDialog/index';
import graphqlActions from '../../redux/Graphql/actions';
import appActions from '../../redux/App/actions';
import { calculateBlock } from '../../helpers/utility';
import { defaults } from '../../config/app';

class CreateEvent extends React.Component {
  static propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
  };

  render() {
    return (
      <Dialog
        fullWidth
        maxWidth="md"
        open={this.props.open}
        onClose={this.props.onClose}
      >
        <DialogTitle>Create an Event</DialogTitle>
        <DialogContent>
          <Grid container>
            <Grid item xs={3}>
              TITLE
            </Grid>
            <Grid item xs={9}>
              <Input
                fullWidth
                multiline
                placeholder="Who will be the next America president in 2020?"
              />
            </Grid>
          </Grid>
          <Grid container>
            <Grid item xs={3}>
              DESCRIPTION
            </Grid>
            <Grid item xs={9}>
              <Input
                fullWidth
                multiline
                rows="3"
                placeholder="Introduction (opitonal)"
              />
            </Grid>
          </Grid>
          <Grid container>
            <Grid item xs={3}>
              PREDICTION END TIME
            </Grid>
            <Grid item container xs={9}>
              <Grid item xs={4}>
                <TextField
                  fullWidth
                  type="date"
                  defaultValue="2017-05-24"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  fullWidth
                  type="time"
                  defaultValue="07:30"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={4}>
                <Input
                  fullWidth
                  type="input"
                  placeholder="Block Number"
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid container>
            <Grid item xs={3}>
              RESULT END TIME
            </Grid>
            <Grid item container xs={9}>
              <Grid item xs={4}>
                <TextField
                  fullWidth
                  type="date"
                  defaultValue="2017-05-24"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  fullWidth
                  type="time"
                  defaultValue="07:30"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={4}>
                <Input
                  fullWidth
                  type="input"
                  placeholder="Block Number"
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid container>
            <Grid item xs={3}>
              OUTCOMES
            </Grid>
            <Grid item xs={9}>
              <TextField
                fullWidth
                placeholder="Outcome Name"
                InputProps={{
                  startAdornment: <InputAdornment position="start">#1</InputAdornment>,
                }}
              />
              <TextField
                fullWidth
                placeholder="Outcome Name"
                InputProps={{
                  startAdornment: <InputAdornment position="start">#2</InputAdornment>,
                }}
              />
              <Button color="primary">
                + Add Result
              </Button>
            </Grid>
          </Grid>
          <Grid container>
            <Grid item xs={3}>
              RESULT SETTER
            </Grid>
            <Grid item xs={9}>
              <Input
                fullWidth
                multiline
                placeholder="0x399fad5f0d6194c23de3b2d6b8dfa55efa679876"
              />
            </Grid>
          </Grid>
          <Grid container>
            <Grid item xs={3}>
              WALLET ADDRESS
            </Grid>
            <Grid item xs={9}>
              <Select
                fullWidth
                value="0x399fad5f0d6194c23de3b2d6b8dfa55efa679876"
                inputProps={{
                  id: 'address',
                }}
              >
                <MenuItem value="0x399fad5f0d6194c23de3b2d6b8dfa55efa679876">
                  0x399fad5f0d6194c23de3b2d6b8dfa55efa679876
                </MenuItem>
                <MenuItem value="0x399fad5f0d6194c23de3b2d6b8dfa55efa679878">
                  0x399fad5f0d6194c23de3b2d6b8dfa55efa679876
                </MenuItem>
              </Select>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={this.props.onClose}>
            Cancel
          </Button>
          <Button color="primary" variant="raised">
            Publish
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

const mapStateToProps = (state) => ({
  txReturn: state.Graphql.get('txReturn'),
  walletAddresses: state.App.get('walletAddresses'),
  lastUsedAddress: state.App.get('lastUsedAddress'),
  chainBlockNum: state.App.get('chainBlockNum'),
  averageBlockTime: state.App.get('averageBlockTime'),
});

function mapDispatchToProps(dispatch) {
  return {
    createTopicTx: (
      name,
      results,
      centralizedOracle,
      bettingStartTime,
      bettingEndTime,
      resultSettingStartTime,
      resultSettingEndTime,
      senderAddress
    ) => dispatch(graphqlActions.createTopicTx(
      name,
      results,
      centralizedOracle,
      bettingStartTime,
      bettingEndTime,
      resultSettingStartTime,
      resultSettingEndTime,
      senderAddress
    )),
    getInsightTotals: () => dispatch(appActions.getInsightTotals()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(injectIntl(CreateEvent)));
