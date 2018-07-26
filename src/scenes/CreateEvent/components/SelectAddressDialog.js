import React from 'react';
import { inject, observer } from 'mobx-react';
import { List, ListItem, ListItemText, Dialog, DialogTitle } from '@material-ui/core';
import { FormattedMessage, injectIntl } from 'react-intl';


const SelectAddressDialog = observer(({ store: { createEvent, wallet } }) => (
  <Dialog
    open={createEvent.resultSetterDialogOpen}
    onClose={() => createEvent.resultSetterDialogOpen = false}
  >
    <DialogTitle>
      <FormattedMessage id="selectAddressDialog.selectResultSetter" defaultMessage="Select Result Setter" />
    </DialogTitle>
    <List>
      {wallet.addresses.map(({ address }) => (
        <ListItem
          button
          onClick={() => createEvent.setResultSetter(address)}
          key={address}
        >
          <ListItemText primary={address} />
        </ListItem>
      ))}
    </List>
  </Dialog>
));

export default injectIntl(inject('store')(SelectAddressDialog));
