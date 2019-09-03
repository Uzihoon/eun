import React, { Component } from "react";
import List from "components/List";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

class ListContainer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      listRender: [
        {
          title: "No",
          key: "no",
          render: (date, key) => key+1
        },
        {
          title: "Name",
          key: "name"
        },
        {
          title: "Files",
          key: "fileCount"
        },
        {
          title: "Target",
          key: "target"
        },
        {
          title: "Change",
          key: "change"
        },
        {
          "title": "Average",
          key: "average"
        },
        {
          title: "Reported Date",
          key: "date"
        },
        {
          title: "",
          key: "download",
          render: date => <span>Test</span>
        }
      ]
    }
  }

  render() {
    return <List {...this} {...this.state} {...this.props} />;
  }
}

export default connect(
  state => ({
    userInfo: state.state.get("userInfo").toJS()
  }),
  null
)(ListContainer);
