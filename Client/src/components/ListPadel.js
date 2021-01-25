import React, { Component } from 'react';
import Fetch from 'react-fetch-component';

export default class ListPadel extends Component {
  render() {
    const url = `/api/padel`;

    return (
      <div>
        <h1 class="mt-2 mb-4"><strong>Padel</strong> <span class="text-muted small">next 15 days</span></h1>
        <Fetch url={url} >
          {({ loading, data, error }) => (
            <div>
              {loading && <div class="spinner-border" role="status">
                <span class="visually-hidden"></span>
              </div>}
              {data && data.map((val, i) => {
                return <div class="card text-center mb-3 text-primary">
                  <div class="card-header">
                    <span class="badge rounded-pill bg-info">{val.date}</span>
                    <span class="small text-muted p-3">{val.weekday}</span>
                  </div>
                  <div class="card-body">
                    <h4 class="card-title text-info"><strong>{val.name}</strong></h4>
                    <p class="card-text">{val.address}</p>
                  </div>
                  <div class="card-footer text-muted small p-1">{val.duration + ' -- ' + val.cost}</div>
                </div>
              })}
            </div>
          )}
        </Fetch>
      </div>
    );
  }
}
