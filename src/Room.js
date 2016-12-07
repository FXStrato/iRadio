/*eslint no-unused-vars: "off"*/ //don't show warnings for unused
import React, {Component} from 'react';
import firebase from 'firebase';
import {Row, Col} from 'react-materialize';
import {Tabs, Tab} from 'material-ui';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';

import {Link, hashHistory} from 'react-router';
import SwipeableViews from 'react-swipeable-views';
import Search from './Search';
import SongList from './SongList';
import RadioPlayer from './ReactPlayer';

//Room that will host all the functionality of our app. Need tabs for queue, history, and now playing
class Room extends Component {
  state = {
    roomID: '',
    value: 0,
    userID: null,
    userEmail: null,
  }

  componentWillUnmount = () => {
    this.auth();
  }

  componentDidMount = () => {
    this.setState({roomID: this.props.params.roomID})
    /* Add a listener and callback for authentication events */
    this.auth = firebase.auth().onAuthStateChanged(user => {
      if(user) {
        this.setState({userID:user.uid});
        this.setState({userEmail:user.email})
      }
      else{
        this.setState({userID: null}); //null out the saved state
        this.setState({userEmail: null})
      }
    })
  }

  handleChange = value => {
    this.setState({value: value});
  }

  searchCallback = result => {
    if(result) {
      this.setState({value: 1});
    }
  }

  render() {
    return (
      <div>
        <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
          <Tabs value={this.state.value} onChange={this.handleChange} inkBarStyle={{backgroundColor: '#00E5FF'}}>
            <Tab label="Now Playing" value={0} style={{backgroundColor: '#424242', color: '#fff'}}>
            </Tab>
            <Tab label="Queue" value={1} style={{backgroundColor: '#424242', color: '#fff'}}>
            </Tab>
            <Tab label="Search" value={2} style={{backgroundColor: '#424242', color: '#fff'}}>
            </Tab>
            <Tab label="History" value={3} style={{backgroundColor: '#424242', color: '#fff'}}>
            </Tab>
          </Tabs>
        </MuiThemeProvider>
        <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
          <SwipeableViews
            index={this.state.value}
            onChangeIndex={this.handleChange}>
            <div className="container">
              <Row>
                <br/>
                <Col s={12}>
                  <h1 className="center-align flow-text">Now Playing</h1>
                </Col>
                <Col s={12}>
                  <RadioPlayer room={this.props.params.roomID} />
                </Col>
              </Row>
            </div>
            <div className="container">
              <Row>
                <Col s={12}>
                  <h1 className="flow-text center-align">Queue</h1>
                </Col>
              </Row>
              <SongList room={this.props.params.roomID} user={this.state.userID} listType="queue"/>
            </div>
            <div className="container">
              <Row>
                <Col s={12}>
                  <h1 className="center-align flow-text">Search</h1>
                  <Search
                    apiKey='AIzaSyAtSE-0lZOKunNlkHt8wDJk9w4GjFL9Fu4'
                    callback={this.searchCallback}
                    room={this.state.roomID} />
                </Col>
              </Row>
            </div>
            <div className="container">
              <h1 className="flow-text center-align">History</h1>
              <p>
                <SongList room={this.props.params.roomID} user={this.state.userID} listType="history"/>
              </p>
            </div>
          </SwipeableViews>
        </MuiThemeProvider>
      </div>
    );
  }
}

export default Room;
