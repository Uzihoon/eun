import React, { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './Intro.module.scss';
import bg from 'img/bg.png';
import { connect } from 'react-redux';

const cx = classNames.bind(styles);

function Intro({ intro }) {
  const [stop, setStop] = useState(false);
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    if (!intro) {
      setStop(true);
      setTimeout(() => setHidden(true), 1000);
    }
  }, [intro]);

  return (
    <div className={cx('intro-wrapper', stop && 'stop', hidden && 'hidden')}>
      <div className={cx('loading-logo')} />
      <div className={cx('img-box')}>
        <div className={cx('img')}>
          <img src={bg} />
        </div>
      </div>
      <div className={cx('logo-box')}>
        <div className={cx('logo')}>EUN</div>
        <div className={cx('desc')}>
          <span>Analysis CRISPR/Cas</span>
        </div>
      </div>
    </div>
  );
}

export default connect(state => ({
  intro: state.state.get('intro')
}))(Intro);
