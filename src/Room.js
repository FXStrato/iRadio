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



//Room that will host all the functionality of our app
class Room extends Component {
  state = {
    roomID: '',
    nowPlaying: {}
  }

  componentDidMount = () => {
    //Obtain information from the passed in roomID. Currently just pulling from nowPlaying, since that was hardcoded in
    this.setState({roomID: this.props.params.roomID})
    let roomRef = firebase.database().ref('channels/' + this.props.params.roomID).once('value').then(snapshot => {
      this.setState({nowPlaying: snapshot.val().nowPlaying});
    });
  }

  render() {
    return (
      <div>
        <Row>
          <br/>
          <Col s={12}>
            <h1>Now Playing {this.state.nowPlaying.title}</h1>
            <img src={this.state.nowPlaying.thumbnail} alt={this.state.nowPlaying.title}/>
          </Col>
        </Row>
        <Row>
          <Col s={12}>
            <h1 className="center-align">Search</h1>
            <Search
              apiKey='AIzaSyAtSE-0lZOKunNlkHt8wDJk9w4GjFL9Fu4'
              callback={this.searchCallback} />
          </Col>
        </Row>
      </div>
    );
  }
}

export default Room;
