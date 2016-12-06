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
    open: false,
    queue: [],
    dialogKey: null,
    dialogTitle: null
  }


  componentDidMount = () => {
    //Obtain information from the passed in roomID. Currently just pulling from nowPlaying, since that was hardcoded in
    this.setState({roomID: this.props.params.roomID})
    let roomRef = firebase.database().ref('channels/' + this.props.params.roomID).once('value').then(snapshot => {
      this.setState({nowPlaying: snapshot.val().nowPlaying});
    });
    //set listener for queue
    let queueRef = firebase.database().ref('channels/' + this.props.params.roomID + '/queue');
    queueRef.on('value', snapshot => {
      let temp = [];
      snapshot.forEach(childsnap => {
        let item = childsnap.val();
        item.key = childsnap.key;
        temp.push(item);
      });
      this.setState({queue: temp});
    })
  }

  handleChange = value => {
    this.setState({value: value});
  }

  searchCallback = result => {
    if(result) {
      this.setState({value: 'q'});
    }
  }

  handleOpen = (key, title) => {
    this.setState({dialogKey: key});
    this.setState({dialogTitle: title});
    this.setState({open: true});
  }

  handleClose = () => {
    this.setState({open: false});
  }

  handleDelete = () => {
    let songRef = firebase.database().ref('channels/' + this.props.params.roomID + '/queue/' + this.state.dialogKey);
    songRef.remove();
    songRef.off();
    this.setState({open: false});
  }

  render() {
    //Populate queue
    let listcontent = _.map(this.state.queue, (elem, index) => {
      return <ListItem
        style={{cursor: 'default'}}
        key={elem.key}
        primaryText={elem.title}
        secondaryText={elem.channel}
        rightIcon={<DeleteIcon style={{cursor: 'pointer'}} onTouchTap={() => this.handleOpen(elem.key, elem.title)} color={'#C2185B'} />}
        leftAvatar={<Avatar color={cyanA400} backgroundColor={transparent}>{index + 1}</Avatar>}
      />
    });

    const actions = [
    <FlatButton
        label="Cancel"
        onTouchTap={this.handleClose}
    />,
    <FlatButton
        label={'Remove Song From Queue'}
        onTouchTap={this.handleDelete}
    />]

    return (
      <div>
        <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
          <Tabs value={this.state.value} onChange={this.handleChange}>
            <Tab label="Now Playing" value="np" style={{backgroundColor: '#424242', color: '#fff'}}>
              <div className="container">
                <Row>
                  <br/>
                  <Col s={12}>
                    <h1 className="center-align">Now Playing </h1>
                  </Col>
                  <Col s={12}>
                    <RadioPlayer room={this.props.params.roomID} />
                  </Col>
                </Row>
              </div>
            </Tab>
            <Tab label="Queue" value="q" style={{backgroundColor: '#424242', color: '#fff'}}>
              <div className="container">
                <Queue room={this.props.params.roomID}/>
                {/* <Row>
                  <Col s={12} className="center-align">
                    <h1>Queue</h1>
                  </Col>
                  <Col s={12}>
                    <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
                      <List>
                        {listcontent}
                      </List>
                    </MuiThemeProvider>
                  </Col>
                </Row> */}
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
        <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
           <Dialog
           title={'Deleting Song From Queue'.toUpperCase()}
           actions={actions}
           modal={false}
           open={this.state.open}>
           Are you sure you wish to remove {this.state.dialogTitle} from the queue?
           </Dialog>
         </MuiThemeProvider>
      </div>
    );
  }
}

export default Room;
