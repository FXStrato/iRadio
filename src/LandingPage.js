/*eslint no-unused-vars: "off"*/ //don't show warnings for unused
import React from 'react';
import firebase from 'firebase';
import {Row, Col} from 'react-materialize';
import {AppBar, FlatButton, Tabs, Tab, RaisedButton, Dialog, TextField, Avatar} from 'material-ui';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import {Link, hashHistory} from 'react-router';
import SignInForm from './SignIn.js';
import SignUpForm from './SignUp.js'


class LandingPage extends React.Component {
  state = {
    signin: true,
    open: false,
    createDialog: false,
    roomName: '',
    errorText: '',
    userEmail: 'init',
    userID: 'init',
    userHandle: '',
    roomMade: null,
    deleteOpen: false
  }

  componentDidMount() {
  /* Add a listener and callback for authentication events */
  this.auth = firebase.auth().onAuthStateChanged(user => {
    if(user) {
      this.setState({userID:user.uid});
      this.setState({userEmail:user.email})
      //Check to see if they have made a room already
      firebase.database().ref('users/' + user.uid).once('value').then(snapshot=> {
        if(snapshot.val()) {
          this.setState({userHandle: snapshot.val().handle})
          firebase.database().ref('channels/' + snapshot.val().handle).once('value').then(snapshot => {
            if(snapshot.val()) {
              this.setState({roomMade: true})
            } else {
              this.setState({roomMade: false})
            }
          });
        }
      });
    }
    else{
      this.setState({userID: null}); //null out the saved state
      this.setState({userEmail: null})
    }
  })
}

componentWillUnmount() {
  //Remove auth listener upon changing routes
    this.auth();
  }

  handleTap = () => {
    let currentState = this.state.signin;
    this.setState({signin: !currentState});
  }

  handleChange = event => {
    var value = event.target.value;
    this.setState({roomName:value});
    if(this.state.errorText !== '') {
      this.setState({errorText: ''});
    }
  }

  handleClose = () => {
    this.setState({open: false});
    this.setState({errorText: ''})
  };

  handleOpen = isCreate => {
    //If true, that means create Room was selected
    if(isCreate) {
      this.setState({createDialog: true});
    } else {
      this.setState({createDialog: false});
    }
    this.setState({open: true});
  }

  handleJoinOwnRoom = () => {
    //Get user handle, and join the room, assigning ownerInRoom to true first
    let ownerRef = firebase.database().ref('/channels/' + this.state.userHandle + '/ownerInRoom');
    ownerRef.set(true);
    ownerRef.off();
    hashHistory.push('room/' + this.state.userHandle);
  }

  handleCreateRoom = () => {
    let roomRef = firebase.database().ref('channels/' + this.state.userHandle);
    roomRef.set({
      listeners: {},
      nowPlaying: {},
      queue: {},
      history: {},
      owner: this.state.userHandle,
      ownerInRoom: true
    })
    roomRef.off();
    this.auth();
    this.handleClose();
    hashHistory.push('room/' + this.state.userHandle);
  }

  handleAction = () => {
    //Need to run a check if room exists here.
    let roomRef = firebase.database().ref('/channels/' + this.state.roomName).once('value').then(snapshot => {
      if(snapshot.val()) {
        //True, means the room exists
        //Edge case of owner joining own room through join room dialog
        if(this.state.roomName === this.state.userHandle) {
          this.handleJoinOwnRoom();
        } else {
          let isOwnerRef = firebase.database().ref('/channels/' + this.state.roomName + '/ownerInRoom').once('value').then(snapshot => {
            if(snapshot.val()) {
              hashHistory.push('room/' + this.state.roomName);
            } else {
              this.setState({errorText: 'Room Owner is not currently in room'});
            }
          })
        }
      } else {
        this.setState({errorText: 'Room "' + this.state.roomName + '" was not found'});
      }
    });
  }

  handleDeleteOpen = () => {
    this.setState({deleteOpen: true});
  }

  handleDelete = () => {
    let songRef = firebase.database().ref('channels/' + this.state.userHandle);
    songRef.set(null).then(() => {
      this.setState({deleteOpen: false});
      this.setState({roomMade: false});
    });
    songRef.off();
  }

  handleDeleteClose = () => {
    this.setState({deleteOpen: false});
  }

  render() {

    const actions = [
    <FlatButton
        label="Cancel"
        onTouchTap={this.handleClose}
    />,
    <FlatButton
        type="submit"
        label={this.state.createDialog ? "Create Room" : "Join Room"}
        onTouchTap={this.state.createDialog ? this.handleCreateRoom : this.handleAction}
    />
    ];

    const deleteActions = [
      <FlatButton
          label="Cancel"
          onTouchTap={this.handleDeleteClose}
      />,
      <FlatButton
          label={'Delete Room'}
          onTouchTap={this.handleDelete}
      />
    ];

    let content = null;
    if(firebase.auth().currentUser) {
      content = <div>
        <Row>
          <Col s={12} className="center-align">
            <h1>Let The Music Flow</h1>
            <div className="flow-text">
              Host your own room and share your music, or get the room ID of a friend and join them!
            </div>
          </Col>
        </Row>
        <Row className="center-align">
          <br/>
          <Col s={12}>
            {this.state.roomMade === true && <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
              <RaisedButton labelStyle={{color:'#fff'}} primary={true} style={{marginRight: '10px'}} label="Enter Your Room" onTouchTap={this.handleJoinOwnRoom}/>
            </MuiThemeProvider>}
            {this.state.roomMade === false && <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
              <RaisedButton labelStyle={{color:'#fff'}} primary={true} style={{marginRight: '10px'}} label="Create Room" onTouchTap={() => {this.handleOpen(true)}}/>
            </MuiThemeProvider>}
            <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
              <RaisedButton labelStyle={{color:'#fff'}} backgroundColor='#0DBAAD' label="Join Room" onTouchTap={() => {this.handleOpen(false)}}/>
            </MuiThemeProvider>
          </Col>
        </Row>
        {this.state.roomMade &&
          <Row>
            <br/>
            <Col s={12} className="center-align">
              <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
                <RaisedButton labelStyle={{color:'#fff'}} backgroundColor='#F50057' label="Delete Room" onTouchTap={this.handleDeleteOpen}/>
              </MuiThemeProvider>
            </Col>
          </Row>
        }
      </div>
    } else if(this.state.userID !== 'init') {
      content =  <div>
        <Row>
          <br/>
          <Col s={12} m={6} l={6}>
            <h1>Welcome to iRadio!</h1>
            <div className="flow-text">
              Queue songs to play, add songs to a friend's room, or make your own room in iRadio!
            </div>
            <br/>
            <div>
              <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
                <RaisedButton style={{width: '45%', marginLeft: '5px', marginRight: '5px'}} label={this.state.signin ? "Go to Sign Up" : "Go to Sign In"} onTouchTap={this.handleTap} backgroundColor="#03A9F4"/>
              </MuiThemeProvider>
              <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
                <RaisedButton labelStyle={{color:'#fff'}} style={{width: '45%', marginLeft: '5px', marginRight: '5px'}} backgroundColor='#0DBAAD' label="Join Room" onTouchTap={() => {this.handleOpen(false)}}/>
              </MuiThemeProvider>
            </div>
          </Col>
          <Col s={12} m={6} l={6}>
            {this.state.signin ? <SignInForm/> : <SignUpForm/>}
          </Col>
        </Row>
      </div>
    }

    return (
      <div className="container">
        {content}
        <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
           <Dialog
           title={this.state.createDialog ? 'Create Your Room'.toUpperCase() : 'Join A Room'.toUpperCase()}
           actions={actions}
           modal={false}
           open={this.state.open}>
           {this.state.createDialog ? "Create a room to share music with friends!" : "Join a pre-existing friends room!"} <br/>
           {!this.state.createDialog &&
              <form onSubmit={this.handleAction}>
                <Col s={12} className="input-field">
                  <TextField
                    type="text"
                    floatingLabelText="Room ID"
                    onChange={this.handleChange}
                    errorText={this.state.errorText}
                  />
                </Col>
              </form>
              }
           </Dialog>
         </MuiThemeProvider>
         <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
            <Dialog
            title={'Deleting Room'}
            actions={deleteActions}
            modal={false}
            open={this.state.deleteOpen}
            onRequestClose={this.handleDeleteClose}
            autoScrollBodyContent={true}>
            Are you sure you wish to completely remove your room? You can remake at any time, but you will lose your current queue and history.
            </Dialog>
          </MuiThemeProvider>
      </div>
    );
  }
}

export default LandingPage;
