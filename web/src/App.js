import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import './App.css';
import Header from "./components/Header";
import Home from "./pages/Home/Home";
import Subscriptions from './pages/Subscriptions/Subscriptions';
import Settings from './pages/Settings/Settings';
import About from "./pages/About/About";

import Title from "./components/Title";

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
      </div>
      <div className="container-fluid" style={{"padding":"20px"}}>
        <Switch>
          <Route path="/subscriptions">
            <Title text="Subscriptions" />
            <Subscriptions />
          </Route>
          <Route path="/settings">
            <Title text="Settings" />
            <Settings />
          </Route>
          <Route path="/about">
            <Title text="About" />
            <About />
          </Route>
          <Route path="/">
            <Title text="Home" />
            <Home />
          </Route>

        </Switch>
      </div>

    </Router>
  );
}

export default App;
