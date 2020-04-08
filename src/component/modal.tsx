import * as React from 'react';
import { Modal } from 'react-bootstrap';
import { history } from 'src';

const moment = require('moment');

import { constant } from 'src/constant';

export const modal = () => {
  const [display, set_display] = React.useState(false);
  const [storage, set_storage] = React.useState(
    JSON.parse(localStorage.getItem('history'))
  );

  return React.useMemo(() => {
    return (
      <>
        <button
          type="button"
          className="btn btn-info"
          data-toggle="modal"
          data-target="#modal0"
          onClick={() => set_display(true)}
        >
          作成履歴
        </button>

        <Modal show={display} onHide={() => set_display(false)}>
          <Modal.Header closeButton>
            <h5 className="modal-title">作成履歴(直近3件)</h5>
          </Modal.Header>
          <Modal.Body style={{ background: '#f7f7f7' }}>
            <div className="card" style={{ background: '#f7f7f7' }}>
              {storage === null
                ? ''
                : storage.map((row, i) => {
                    return (
                      <div key={i}>
                        <ul className="list-group list-group-flush">
                          <li className="list-group-item">
                            {moment(row['created_at']).format(
                              'YYYY-MM-DD HH:mm:ss'
                            )}
                          </li>
                          <li className="list-group-item">{row['title']}</li>
                          <li className="list-group-item">
                            {constant.LANG[row['genreId']]}
                          </li>
                          <li className="list-group-item">
                            <button
                              className="btn btn-primary"
                              onClick={() => {
                                history.push(`/code.html?q=${row['query']}`);
                              }}
                            >
                              ソースを見る
                            </button>
                          </li>
                          <li className="list-group-item">
                            <button
                              className="btn btn-danger"
                              onClick={() => {
                                const _history = JSON.parse(
                                  JSON.stringify(storage)
                                );
                                if (!confirm('削除しますか？')) {
                                  return;
                                }

                                i === 0
                                  ? _history.shift()
                                  : _history.splice(i, i);

                                localStorage.setItem(
                                  'history',
                                  JSON.stringify(_history)
                                );

                                set_storage(_history);

                                alert('削除しました');
                              }}
                            >
                              削除
                            </button>
                          </li>
                        </ul>
                        <br />
                        <br />
                      </div>
                    );
                  })}
            </div>
          </Modal.Body>
        </Modal>
      </>
    );
  }, [display, storage]);
};
