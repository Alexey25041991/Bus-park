import React from 'react'
import browserHistory from 'history.js'
import { Router, Route } from 'react-router-dom'
import Main from 'p/Main'
import AddBus from 'p/AddBus'
import AddDriver from 'p/AddDriver'
import 'App.css'

import 'dbConnection'

function App() {
  return (
    <div className="cont">
      <Router history={browserHistory}>
        <div>
          <Route path='/' exact component={Main} />
          <Route path='/add/bus' component={AddBus} />
          <Route path='/add/driver' component={AddDriver} />
        </div>
      </Router>
    </div>
  );
}

export default App
