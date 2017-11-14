import React, { Component } from 'react';
import { connect } from 'react-redux';
import { InputSearch } from '../../components/uielements/input';
import TopbarSearchModal from './topbarSearchModal.style';

class Searchbar extends Component {
  componentDidMount() {
    setTimeout(() => {
      try {
        document.getElementById('InputTopbarSearch').focus();
      } catch (e) {}
    }, 200);
  }
  render() {
    return (
      <InputSearch
        id="InputTopbarSearch"
        size="large"
        placeholder="Enter search text"
      />
    );
  }
}

class TopbarSearch extends Component {
  constructor(props) {
    super(props);
    this.handleOk = this.handleOk.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.showModal = this.showModal.bind(this);
    this.state = {
      visiblity: false
    };
  }

  handleOk() {
    this.setState({
      visible: false
    });
  }
  handleCancel() {
    this.setState({
      visible: false
    });
  }
  showModal() {
    this.setState({
      visible: true
    });
  }
  render() {
    const { customizedTheme } = this.props;
    const { visible } = this.state;
    return (
      <div onClick={this.showModal}>
        {/* <Button type="primary" onClick={this.showModal}>Open</Button> */}
        <i
          className="ion-ios-search-strong"
          style={{ color: customizedTheme.textColor }}
        />
        <TopbarSearchModal
          title="Basic Modal"
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          wrapClassName="isoSearchModal"
          width="60%"
          footer={null}
        >
          <div className="isoSearchContainer">
            {visible ? <Searchbar /> : ''}
          </div>
        </TopbarSearchModal>
      </div>
    );
  }
}

export default connect(state => ({
  ...state.App.toJS(),
  customizedTheme: state.ThemeSwitcher.toJS().topbarTheme
}))(TopbarSearch);
