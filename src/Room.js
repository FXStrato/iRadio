/*eslint no-unused-vars: "off"*/ //don't show warnings for unused
import React, {Component} from 'react';
import firebase from 'firebase';
import {Row, Col} from 'react-materialize';
import {Tabs, Tab, RaisedButton} from 'material-ui';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import {Link, hashHistory} from 'react-router';
import SwipeableViews from 'react-swipeable-views';
import Search from './Search';
import SongList from './SongList';
import RadioPlayer from './ReactPlayer';

const isMobile = {
  Android: function() {
      return navigator.userAgent.match(/Android/i);
  },
  BlackBerry: function() {
      return navigator.userAgent.match(/BlackBerry/i);
  },
  iOS: function() {
      return navigator.userAgent.match(/iPhone|iPad|iPod/i);
  },
  Opera: function() {
      return navigator.userAgent.match(/Opera Mini/i);
  },
  Windows: function() {
      return navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/WPDesktop/i);
  },
  any: function() {
      return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
  }
};

//Room that will host all the functionality of our app. Need tabs for queue, history, and now playing
class Room extends Component {
  state = {
    roomID: '',
    value: 0,
    userID: null,
    userEmail: null,
    userHandle: '',
    isOwner: false,
    isMobile: false
  }

  componentWillUnmount = () => {
    //TODO: This needs to be made so that if the owner is one the one leaving, it sets ownerInRoom to false, and then shows a dialog and makes everyone else leave.
    let temp = firebase.database().ref('channels/' + this.props.params.roomID + '/ownerInRoom');
    temp.set(false)
    temp.off();
    this.auth();
  }

  componentDidMount = () => {
    //Set listener so that if owner leaves, dialog shows up that will cause everyone else to leave the room.
    this.ownerRef = firebase.database().ref('channels/' + this.props.params.roomID + '/ownerInRoom').once('value').then(snapshot => {
      console.log(snapshot.val()); //IF this is false, means owner is not in room
    })

    this.setState({roomID: this.props.params.roomID})
    /* Add a listener and callback for authentication events */
    this.auth = firebase.auth().onAuthStateChanged(user => {
      if(user) {
        this.setState({userID:user.uid});
        this.setState({userEmail:user.email})
        firebase.database().ref('users/' + user.uid).once('value').then(snapshot=> {
          if(snapshot.val()) {
            if(snapshot.val().handle === this.props.params.roomID) {
              //In here, set ownerInRoom to true in firebase.
              this.setState({isOwner: true});
              let temp = firebase.database().ref('channels/' + snapshot.val().handle + '/ownerInRoom');
              temp.set(true);
              temp.off();
            }
            this.setState({userHandle: snapshot.val().handle})
          }
        });
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
            <Tab label={<span className="tab-names">Now Playing</span>} value={0} style={{backgroundColor: '#424242', color: '#fff'}}>
              <div className="container">
                <Row>
                  <br/>
                  <Col s={12}>
                    <h1 className="center-align flow-text">Now Playing</h1>
                  </Col>
                  {!isMobile.any() ?
                    <Col s={12}>
                    <RadioPlayer room={this.props.params.roomID} isOwner={this.state.isOwner} />
                  </Col> :
                    <Col s={12}>
                      <div>Currently disabled for mobile, but you can still add to queue!</div>
                    </Col>}
                </Row>
              </div>
            </Tab>
            <Tab label={<span className="tab-names">Queue</span>}  value={1} style={{backgroundColor: '#424242', color: '#fff'}}>
              <div className="container">
                <Row>
                  <Col s={12}>
                    <h1 className="flow-text center-align">Next Songs</h1>
                    <SongList room={this.props.params.roomID} user={this.state.userID} isOwner={this.state.isOwner} listType="queue"/>
                  </Col>
                </Row>
              </div>
            </Tab>
            <Tab label={<span className="tab-names">Search</span>} value={2} style={{backgroundColor: '#424242', color: '#fff'}}>
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
            <Tab label={<span className="tab-names">History</span>} value={3} style={{backgroundColor: '#424242', color: '#fff'}}>
              <div className="container">
                <Row>
                  <Col s={12}>
                    <h1 className="flow-text center-align">History</h1>
                      <SongList room={this.props.params.roomID} user={this.state.userID} isOwner={this.state.isOwner} listType="history"/>
                  </Col>
                </Row>
              </div>
            </Tab>
          </Tabs>
        </MuiThemeProvider>
      </div>
    );
  }
}

export default Room;
