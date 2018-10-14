import React from 'react';

export class HomePage extends React.Component {
  render() {
    return (
      <div>
      <div style={{
        backgroundColor: 'green',
        border: 'thick solid #AAAAFF',
        borderStyle: 'double',
        borderRadius: '25px',
        padding: '10px',
        boxShadow: '2px 2px 10px black'
      }}>
        <h1>{'Welcome'}</h1>
      </div>
      </div>
    );
  }
}


export default { HomePage };