/*eslint no-unused-vars: "off"*/ //don't show warnings for unused
import React, {Component} from 'react';
import firebase from 'firebase';
import {Row, Col} from 'react-materialize';
import {AppBar, FlatButton, Tabs, Tab, RaisedButton, List, ListItem, Avatar, Dialog} from 'material-ui';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import {Link, hashHistory} from 'react-router';
import Search from './Search';
import Queue from './Queue';
import RadioPlayer from './ReactPlayer';
import _ from 'lodash';
import {cyanA400, transparent} from 'material-ui/styles/colors';
import DeleteIcon from 'material-ui/svg-icons/action/delete';



//Room that will host all the functionality of our app. Need tabs for queue, history, and now playing
class Room extends Component {
  state = {
    roomID: '',
    nowPlaying: {},
    value: 'np',
    userID: null,
    userEmail: null,
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
    firebase.database().ref('channels/' + this.props.params.roomID).once('value').then(snapshot => {
      if(snapshot.val().nowPlaying) {
          this.setState({nowPlaying: snapshot.val().nowPlaying});
      }
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
      <div>
        <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
          <Tabs value={this.state.value} onChange={this.handleChange} inkBarStyle={{backgroundColor: '#00E5FF'}}>
            <Tab label="Now Playing" value="np" style={{backgroundColor: '#424242', color: '#fff'}}>
              <div className="container">
                <Row>
                  <br/>
                  <Col s={12}>
                    <h1 className="center-align flow-text">Now Playing </h1>
                  </Col>
                  <Col s={12}>
                    <RadioPlayer room={this.props.params.roomID} />
                  </Col>
                </Row>
              </div>
            </Tab>
            <Tab label="Queue" value="q" style={{backgroundColor: '#424242', color: '#fff'}}>
              <div className="container">
                <Row>
                  <Col s={12}>
                    <h1 className="flow-text center-align">Queue</h1>
                  </Col>
                </Row>
                <Queue room={this.props.params.roomID}/>
              </div>
            </Tab>
            <Tab label="Search" value="s" style={{backgroundColor: '#424242', color: '#fff'}}>
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
            </Tab>
            <Tab label="History" value="h" style={{backgroundColor: '#424242', color: '#fff'}}>
              <div className="container">
                <h1 className="flow-text center-align">History</h1>
                <p>
                  This is where history will go
                </p>
              </div>
            </Tab>
          </Tabs>
        </MuiThemeProvider>
      </div>
    );
  }
}

export default Room;
