import React from 'react';

import './app.scss';

const App: React.FC = () => {

  return (
    <div className='app'>
      <h1>Hello electron</h1>
      <button onClick={() => window.JSBridge.call('func1', { name: 'fff' }).then(res => console.log('func1 res', res))}>message func1</button>
    </div>
  );
};

export default App;