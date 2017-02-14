import React from 'react';
import {Actions, Scene, Router} from 'react-native-router-flux';
import Home from './pages/Home';
import Search from './pages/Search';

const scenes = Actions.create(
  <Scene key="root">
    <Scene key="home" component={Home} initial/>
    <Scene key="search" component={Search} title="Login"/>
  </Scene>
);

export default class App extends React.Component {
  render() {
    return <Router scenes={scenes}/>
  }
}