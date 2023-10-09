import React, { Component } from 'react';
import classNames from 'classnames/bind';
import styles from './PageTemplate.module.scss';
import { Layout } from 'antd';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import TopBar from 'components/common/TopBar';
import { VERSION } from 'environment';
import Question from 'components/Question';
import Banner from 'components/common/Banner';

import * as stateActions from 'store/modules/state';
import * as uploadActions from 'store/modules/upload';

const { Content } = Layout;

const cx = classNames.bind(styles);

class PageTemplate extends Component {
  pushPage = (url) => {
    const { history } = this.props;
    history.push(url);
  };

  handleLogout = (_) => {
    const { StateActions, history } = this.props;
    StateActions.logout(history);
  };

  render() {
    const { children, nolayout } = this.props;
    return (
      <Layout className={cx('full-layout')}>
        <Banner />
        <Question />
        <TopBar {...this.props} {...this} />
        <Layout className={cx('content-layout')}>
          {nolayout ? (
            children
          ) : (
            <Layout className={cx('main-layout')}>
              <Content className={cx('eun-content')}>{children}</Content>
              <div className={cx('footer')}>
                <a href='https://github.com/Uzihoon'>
                  {`© 2019 - ${new Date().getFullYear()} Uzihoon All rights reserved`}
                </a>
                <div className={cx('line')}></div>
                <a href='/#/version'>{VERSION} version</a>
              </div>
            </Layout>
          )}
        </Layout>
      </Layout>
    );
  }
}

export default withRouter(
  connect(
    (state) => ({
      menuList: state.state.get('menuList'),
    }),
    (dispatch) => ({
      StateActions: bindActionCreators(stateActions, dispatch),
      UploadActions: bindActionCreators(uploadActions, dispatch),
    })
  )(PageTemplate)
);
