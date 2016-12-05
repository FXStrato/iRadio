/*eslint no-unused-vars: "off"*/ //don't show warnings for unused
import React, {Component} from 'react';
import firebase from 'firebase';
import {Row, Col} from 'react-materialize';
import {AppBar, FlatButton, Tabs, Tab, RaisedButton} from 'material-ui';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import {Link, hashHistory} from 'react-router';
import Search from './Search';
import RadioPlayer from './ReactPlayer';



//Room that will host all the functionality of our app. Need tabs for queue, history, and now playing
class Room extends Component {
  state = {
    roomID: '',
    nowPlaying: {},
    value: 'np'
  }

  componentDidMount = () => {
    //Obtain information from the passed in roomID. Currently just pulling from nowPlaying, since that was hardcoded in
    this.setState({roomID: this.props.params.roomID})
    let roomRef = firebase.database().ref('channels/' + this.props.params.roomID).once('value').then(snapshot => {
      this.setState({nowPlaying: snapshot.val().nowPlaying});
    });
  }

  handleChange = value => {
    this.setState({value: value});
  }

  searchCallback = result => {
    if(result) {
      this.setState({value: 'q'});
    }
  }

  render() {
    return (
        <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
          <Tabs value={this.state.value} onChange={this.handleChange}>
            <Tab label="Now Playing" value="np" style={{backgroundColor: '#424242', color: '#fff'}}>
              <div className="container">
                <Row>
                  <br/>
                  <Col s={12}>
                    <h1 className="center-align">Now Playing {this.state.nowPlaying.title}</h1>
                    <RadioPlayer room={this.props.params.roomID}  />
                  </Col>
                </Row>
              </div>
            </Tab>
            <Tab label="Queue" value="q" style={{backgroundColor: '#424242', color: '#fff'}}>
              <div className="container">
                <h1>Queue</h1>
                <p>
                  This is where queue happens
                </p>
              </div>
            </Tab>
            <Tab label="Search" value="s" style={{backgroundColor: '#424242', color: '#fff'}}>
              <div className="container">
                <Row>
                  <Col s={12}>
                    <h1 className="center-align">Search</h1>
                    <Search
                      apiKey='AIzaSyAtSE-0lZOKunNlkHt8wDJk9w4GjFL9Fu4'
                      callback={this.searchCallback}
                      room={this.state.roomID} />
                  </Col>
                </Row>
              </div>
            </Tab>
            <Tab label="History" value="h" style={{backgroundColor: '#424242', color: '#fff'}}>
              <div className="container">
                <h1>History</h1>
                <p>
                  This is where history will go
                </p>
              </div>
            </Tab>
          </Tabs>
        </MuiThemeProvider>
    );
  }
}

export default Room;
