import React, { Component } from 'react';
import Fetch from 'react-fetch-component';

export default class ListPadel extends Component {
  render() {

    const url = `http://localhost:3000/api/padel`;

    return (
      <div>
        <h1>Padel</h1>
        <Fetch url={url} >
          {({ loading, data, error }) => (
            <div>
              {loading && <span>Loading...</span>}
              {console.log("data", data)}
              <ul>
                {data && data.map((val, i) => {
                  return <div key={i}>
                      <li>{val.date + ' ' + val.duration + ' ' + val.weekday}</li>
                      <p>{val.name + ' ' + val.address + ' -- (' + val.cost + ')'}</p>
                    </div>
                })}
              </ul>
            </div>
          )}
        </Fetch>
      </div>
    );
  }
}