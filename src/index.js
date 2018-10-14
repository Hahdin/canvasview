import React from 'react'
import ReactDOM from 'react-dom'
import App from '../components/App'
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";
const routes = (
  <BrowserRouter>
    <Switch>
      <Route path="/" component={App} />
      <Redirect from="/" to="/" />
    </Switch>
  </BrowserRouter>
);

ReactDOM.render(routes, document.getElementById('root'))