import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Upload from 'components/Upload';
import Loading from 'components/common/Loading';
import { withRouter } from 'react-router';
import { getUniqId } from 'lib/utility';

import * as uploadActions from 'store/modules/upload';
import * as analysisActions from 'store/modules/analysis';
import * as stateActions from 'store/modules/state';

class UploadContainer extends Component {
  constructor(props) {
    super(props);
    const { UploadActions } = props;
    this.state = {
      uploadInfo: {
        name: 'gz',
        aceept: 'application/gzip, .gz',
        beforeUpload: file => {
          const { fileList } = this.props;
          const list = fileList ? fileList.toJS() : [];
          const hasFile = list.findIndex(e => e.name === file.name);
          if (hasFile < 0) {
            UploadActions.handleFileList(file);
          }
          return false;
        },
        multiple: true,
        onRemove(file) {
          UploadActions.deleteFileList(file);
          return true;
        },
        onChange: info => {
          const { file } = info;
          if (file.status !== 'uploading') {
            // upload 중이 아닐 때 실행할 action
          }
          if (file.status === 'done') {
            // upload 완료 후 실행할 액션
          }
        }
      },
      loading: false,
      title: '',
      gauge: 0,
      workerNum: 0,
      postWorker: 0,
      analysisId: null,
      runJSON: false,
      sequenceList: ['A', 'G', 'C', 'T']
    };
  }

  handleBeforeUpload = e => {
    e.preventDefault();
    e.returnValue = '';
  };

  shouldComponentUpdate(nextProps, nextState) {
    const {
      format,
      StateActions,
      AnalysisActions,
      history,
      sampleLoading,
      failList
    } = nextProps;
    const { handleData } = this;
    const { runJSON } = nextState;
    let analysisId = nextState.analysisId;

    if (sampleLoading && format.get('sample') && !analysisId) {
      analysisId = 'sample';
      this.setState({ analysisId: 'sample' });
    }

    const nextFormat = format.get(analysisId);
    const prevFormat = this.props.format.get(analysisId);

    if (runJSON && nextProps.analysised) {
      AnalysisActions.saveAnalysisImmu({ type: 'analysised', data: false });
      history.push(`/analysis/${analysisId}`);
    }

    if (
      !runJSON &&
      nextFormat &&
      !nextFormat.equals(prevFormat) &&
      Object.keys(nextFormat.toJS()).length >= 1
    ) {
      const data = nextFormat.toJS() || {};
      const { fileList } = data;
      const fail = [];
      let workerNum = 0;
      let worker;

      for (let i in fileList) {
        const files = fileList[i].sort((a, b) =>
          ('' + a.name).localeCompare(b.name)
        );
        if (files.length < 2) {
          fail.push(i);
        } else {
          data.files = files;
          data.fileId = i;
          worker = new Worker('/worker.js');
          worker.postMessage(data);
          worker.onmessage = function(e) {
            handleData(e.data);
          };
          ++workerNum;
        }
      }

      if (fail.length === Object.keys(fileList).length) {
        StateActions.showMsg({
          status: 'warning',
          content: 'Please check file again!'
        });
      } else {
        const newFailList = failList.concat(fail);
        AnalysisActions.saveAnalysis({ type: 'failList', data: newFailList });
        this.setState({
          loading: true,
          title: 'Analyzing',
          workerNum
        });
        window.addEventListener('beforeunload', this.handleBeforeUpload);
      }
    }

    if (this.state.postWorker !== nextState.postWorker) {
      if (nextState.postWorker === this.state.workerNum) {
        this.setState({ loading: false });
        window.removeEventListener('beforeunload', this.handleBeforeUpload);
        history.push(`/analysis/${analysisId}`);
      }
    }

    if (this.state.loading !== nextState.loading) {
      return true;
    }

    if (this.state.gauge !== nextState.gauge) {
      return true;
    }

    if (this.props.sampleLoading !== nextProps.sampleLoading) {
      return true;
    }

    return false;
  }

  wrappedComponentRef = ref => {
    this.uploadForm = ref;
  };

  setRef = ref => {
    this.jsonInput = ref;
  };

  handleChange = e => {
    const { UploadActions, StateActions } = this.props;
    StateActions.setState({ key: 'innerLoading', value: true });
    const json = e.target.files[0];
    const analysisId = getUniqId();

    UploadActions.analysisJson({ json, analysisId });
    this.setState({ runJSON: true, analysisId });
  };

  handleJson = _ => {
    this.jsonInput.click();
  };

  handleSubmit = _ => {
    const { UploadActions, fileList, StateActions } = this.props;
    const form = this.uploadForm.props.form;
    const files = fileList.toJS();
    form.validateFields((err, val) => {
      if (err) return;

      const evenFile = files.length % 2;
      if (evenFile > 0) {
        StateActions.showMsg({
          status: 'warning',
          content: 'Please check file again!'
        });
        return;
      }
      val.nuctype = 0;
      val.files = files;
      const analysisId = getUniqId();
      this.setState({ analysisId });
      UploadActions.formatData({ data: val, analysisId });
    });
  };

  handleData = data => {
    const { AnalysisActions, StateActions } = this.props;
    let { postWorker, analysisId } = this.state;
    if (data.msgType === 2) {
      this.setState({
        gauge: data.msg
      });
    } else {
      if (data.msgType === 0) {
        AnalysisActions.saveAnalysises({
          types: ['summary', analysisId],
          data: data.msg
        });
      } else if (data.msgType === 4) {
        const fileId = data.msg.fileId;
        AnalysisActions.analysised({ analysisId, fileId, data: data.msg });
        this.setState({ postWorker: ++postWorker });
      } else {
        StateActions.showMsg({
          status: 'error',
          content: data.msg
        });
      }
    }
  };

  validationCheck = (rule, value, callback) => {
    const char = value.toUpperCase();
    const sequence = ['A', 'C', 'G', 'T'];
    let msg = undefined;
    if (!sequence.includes(char)) {
      msg = 'Please check sequence';
    }
    return callback(msg);
  };

  checkNumber = (rule, value, callback) => {
    let msg = undefined;

    if (!+value) {
      msg = 'Please input number';
    }

    return callback(msg);
  };

  runSample = _ => {
    const { sampleLoading, AnalysisActions } = this.props;
    if (sampleLoading) return false;
    AnalysisActions.runSample();
  };

  render() {
    const { loading, title, gauge } = this.state;
    return (
      <>
        <Upload {...this.state} {...this} {...this.props} />
        {loading && <Loading title={title} gauge={gauge} />}
      </>
    );
  }
}

export default withRouter(
  connect(
    state => ({
      nucleaseTypeList: state.upload.get('nucleaseTypeList').toJS(),
      nucleaseList: state.upload.get('nucleaseList').toJS(),
      format: state.analysis.get('format'),
      fileList: state.upload.get('fileList'),
      failList: state.analysis.get('failList').toJS(),
      sampleLoading: state.state.get('sampleLoading'),
      analysised: state.analysis.get('analysised')
    }),
    dispatch => ({
      UploadActions: bindActionCreators(uploadActions, dispatch),
      AnalysisActions: bindActionCreators(analysisActions, dispatch),
      StateActions: bindActionCreators(stateActions, dispatch)
    })
  )(UploadContainer)
);
