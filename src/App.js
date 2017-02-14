import React from 'react';
import { Actions, Scene, Router } from 'react-native-router-flux';
import Home from './pages/Home';
import Search from './pages/Search';
import Reader from './pages/Reader';

const scenes = Actions.create(
    <Scene key="root" hideNavBar >
        <Scene key="home" component={Home} initial />
        <Scene key="search" component={Search} title="Login" />
        <Scene key="reader" component={Reader} title="Reader" />
    </Scene>
);

global.route = Actions;

export default class App extends React.Component {
    render() {
        return <Router scenes={scenes} />
    }
}