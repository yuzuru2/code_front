import * as React from 'react';
import { Link } from 'react-router-dom';
import Highlight from 'react-highlight';

const QRCode = require('qrcode');
const copy = require('copy-to-clipboard');

import { loading } from 'src/component/loading';
import { constant } from 'src/constant';
import { history } from 'src';
import { i_responce } from 'src/interface/i_response';

export const code = () => {
  const [display, set_display] = React.useState(false);

  const [qr, set_qr] = React.useState('');
  const [title, set_title] = React.useState('タイトルなし');
  const [lang, set_lang] = React.useState(0);
  const [code, set_code] = React.useState('');

  /**
   * componentDidMount
   */
  React.useEffect(() => {
    fetch(
      `${constant.URL[process.env.NODE_ENV]}/search?${location.search.substring(
        1,
        location.search.length
      )}`,
      {
        method: 'get',
        headers: {
          Authorization: constant.AUTHORIZATION_KEY,
          'Content-Type': 'application/json'
        }
      }
    )
      .then(async res => {
        if (res.status !== 200) {
          history.push('/');
          return;
        }

        const _ret: i_responce['search'] = await res.json();

        QRCode.toDataURL(location.href, (err, url) => {
          set_title(_ret['title']);
          set_lang(_ret['genreId']);
          set_code(_ret['source']);
          set_qr(url);
          set_display(true);
        });
      })
      .catch(e => history.push('/'));
    return () => {};
  }, []);

  /**
   * componentWillUnmount
   */
  React.useEffect(() => {
    return () => {};
  }, []);

  if (!display) {
    return <>{loading()}</>;
  }

  return (
    <>
      <div id="wrap">
        <br />

        <main id="input_area">
          <nav aria-label="パンくずリスト">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/">ホーム</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                ソースコード
              </li>
            </ol>
          </nav>

          <div className="form-group">
            <label>タイトル</label>
            <input
              type="text"
              className="form-control"
              value={title}
              readOnly
            />
          </div>

          <div className="form-group">
            <label>言語</label>
            <input
              type="text"
              className="form-control"
              value={constant.LANG[lang]}
              readOnly
            />
          </div>

          <div className="form-group" style={{ textAlign: 'center' }}>
            <label>URLのQRコード</label>
            <div style={{ margin: 'auto' }}>
              <img
                src={qr}
                style={{ width: 150, height: 150, border: 'solid 1px gray' }}
              ></img>
            </div>
          </div>

          <div id="button_area" style={{ textAlign: 'center' }}>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                copy(location.href);
                alert('URLをコピーしました');
              }}
            >
              URLコピー
            </button>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <button
              type="button"
              className="btn btn-success"
              onClick={() => {
                copy(code);
                alert('ソースをコピーしました');
              }}
            >
              ソースコピー
            </button>
          </div>

          <br />
          <br />
          <div className="form-group">
            <figure className="xCodeBlock">
              <div className="xCodeBlock_code">
                <div>
                  <Highlight className={constant.LANG[lang]}>{code}</Highlight>
                </div>
              </div>
            </figure>
          </div>
        </main>
      </div>
    </>
  );
};
