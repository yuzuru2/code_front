import * as React from 'react';

import { loading } from 'src/component/loading';
import { constant } from 'src/constant';
import { modal } from 'src/component/modal';
import { history } from 'src';
import { i_responce } from 'src/interface/i_response';

const create = (params: {
  title: string;
  lang: string;
  code: string;
  set_display: (bol: boolean) => void;
}) => {
  if (!confirm('作成しますか？')) {
    return;
  }
  // バリデーション
  if (params.title.length === 0) {
    alert('タイトルが入力されていません');
    return;
  }

  if (params.code.length === 0) {
    alert('ソースコードが入力されていません');
    return;
  }

  params.set_display(false);

  // postリクエストを投げる
  fetch(`${constant.URL[process.env.NODE_ENV]}/create`, {
    method: 'post',
    headers: {
      Authorization: constant.AUTHORIZATION_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      genreId: Number(params.lang),
      title: params.title,
      source: params.code
    })
  })
    .then(async res => {
      if (res.status !== 200) {
        alert('不正な操作をされました。');
        return;
      }

      const _ret: i_responce['create'] = await res.json();

      // ローカルストレージ 送信履歴保存
      (() => {
        const _history =
          JSON.parse(localStorage.getItem('history')) === null
            ? []
            : JSON.parse(localStorage.getItem('history'));

        _history.unshift({
          title: params.title,
          genreId: Number(params.lang),
          query: _ret.q,
          created_at: new Date()
        });

        _history.length > 3 ? _history.pop() : '';
        localStorage.setItem('history', JSON.stringify(_history));
      })();

      history.push(`/code.html?q=${_ret['q']}`);
    })
    .catch(err => {
      alert('不正な操作をされました。');
    });
};

export const root = () => {
  const [display, set_display] = React.useState(true);

  const [title, set_title] = React.useState('タイトルなし');
  const [lang, set_lang] = React.useState('0');
  const [code, set_code] = React.useState('');

  /**
   * componentDidMount
   */
  React.useEffect(() => {
    return () => {};
  }, []);

  /**
   * componentWillUnmount
   */
  React.useEffect(() => {
    return () => {};
  }, []);

  const _modal = modal();

  if (!display) {
    return <>{loading()}</>;
  }

  return (
    <>
      <div id="wrap">
        <br />

        <header>
          <img src="/img/header.png" />
        </header>
        <br />

        <main id="input_area">
          {_modal}

          <br />
          <br />

          <div className="form-group">
            <label className="control-label col-xs-2">言語</label>
            <div className="col-xs-3">
              <select
                className="form-control"
                value={lang}
                onChange={e => set_lang(e.target.value)}
              >
                {constant.LANG.map((m, i) => (
                  <option value={i} key={i}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>タイトル</label>
            <input
              type="text"
              className="form-control"
              placeholder="タイトルを入力(15文字以内)"
              maxLength={15}
              value={title}
              onChange={e => set_title(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>ソースコード</label>
            <textarea
              className="form-control"
              rows={7}
              placeholder="2500文字以内"
              maxLength={2500}
              value={code}
              onChange={e => set_code(e.target.value)}
            ></textarea>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => {
              create({
                title: title,
                lang: lang,
                code: code,
                set_display: set_display
              });
            }}
          >
            作成
          </button>
        </main>
      </div>
    </>
  );
};
