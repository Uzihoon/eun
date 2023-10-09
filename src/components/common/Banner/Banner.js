import { Alert } from 'antd';
import AnchorLink from 'antd/lib/anchor/AnchorLink';
import React from 'react';

export default function Banner() {
  return (
    <div style={{ position: 'relative', zIndex: 10000 }}>
      <Alert
        type='info'
        message={
          <div>
            <b>The new EUN analyzer is now available!</b>
            <br />
            <div>
              On December 31, 2023, EUN will be replaced by EUN-V2 and will be
              deprecated. You can now use the EUN-V2{' '}
              <a href='https://eun-v2.com' _blank>
                here
              </a>
              .
            </div>
          </div>
        }
        closable
        banner
      />
    </div>
  );
}
