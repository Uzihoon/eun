import React, { useEffect, useState } from 'react';
import styles from './TopBar.module.scss';
import classNames from 'classnames/bind';
import { Layout } from 'antd';
import Banner from 'components/common/Banner';

const { Header } = Layout;
const cx = classNames.bind(styles);

const TopBar = (props) => {
  const { handleLogout, nolayout, pushPage } = props;
  const [style, setStyle] = useState({});

  // componentDidMount
  useEffect(() => {
    let style = {};

    if (nolayout) {
      style = {
        position: 'relative',
        zIndex: '1000',
        padding: '0',
        background: 'transparent',
      };
    } else {
      style = {
        padding: '0',
        background: `linear-gradient(
          138deg,
          rgba(44, 172, 209, 1) 0%,
          rgba(44, 101, 177, 1) 100%
        )`,
      };
    }

    setStyle(style);
  }, []);

  return (
    <Header className={cx('header')} style={style}>
      <div className={cx('header-box')}>
        <div className={cx('left-side')}>
          <div className={cx('logo')} onClick={(_) => pushPage('/')}>
            <div className={cx('logo-text')}>EUN</div>
          </div>
          {!nolayout &&
            props.menuList.map((menu, i) => (
              <div
                className={cx('menu-box')}
                key={i}
                onClick={(_) => pushPage(menu.url)}
              >
                <div className={cx('menu')}>{menu.title}</div>
              </div>
            ))}
        </div>

        <div className={cx('right-side')}>
          <div className={cx('logout')} onClick={handleLogout}>
            Logout
          </div>
        </div>
      </div>
    </Header>
  );
};

export default TopBar;
