/*eslint no-unused-vars: "off"*/ //don't show warnings for unused
import React, { Component } from 'react';
import {Row, Col} from 'react-materialize';
import {RaisedButton, FlatButton, Dialog, TextField, List, ListItem, AppBar, Popover, IconButton, IconMenu, Avatar, Menu, MenuItem, Toolbar, ToolbarGroup, Paper} from 'material-ui';
import _ from 'lodash';
import RadioPlayer from './ReactPlayer';
import Search from './Search';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import firebase from 'firebase';
import {Link, hashHistory} from 'react-router';
import mainIcon from './img/mainIcon.png';

import LandingPage from './LandingPage';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userEmail: null,
      userID: null,
      userHandle: '',
      open: false,
      dialogOpen: false,
      dialogText: '',
      dialogTitle: ''
    };
  }

  componentDidMount() {
   /* Add a listener and callback for authentication events */
   firebase.auth().onAuthStateChanged(user => {
     if(user) {
       console.log('Auth state changed: logged in as', user.email);
       this.setState({userID:user.uid});
       this.setState({userEmail:user.email})
       firebase.database().ref('users/' + user.uid).once('value').then(snapshot=> {
         if(snapshot.val()) {
           this.setState({userHandle: snapshot.val().handle})
         }
       });
     }
     else{
       console.log('Auth state changed: logged out');
       this.setState({userID: null}); //null out the saved state
       this.setState({userEmail: null})
       this.setState({userHandle: ''});
     }
   })
 }

  handleTouchTap = (event) => {
    // This prevents ghost click.
    event.preventDefault();

    this.setState({
      open: true,
      anchorEl: event.currentTarget,
    });
  };

  handleRequestClose = () => {
    this.setState({
      open: false,
    });
  };

  signOut = () =>  {
    if(hashHistory.getCurrentLocation().pathname !== '/') {
      firebase.auth().signOut().then(() => hashHistory.push('/'))
    }
    else {
      firebase.auth().signOut().then(() => this.forceUpdate())
    }
  }

  goHome = () => {
    if(hashHistory.getCurrentLocation().pathname !== '/') {
      hashHistory.push('/');
    }
  }

  handleDialogClose = () => {
    this.setState({dialogOpen: false});
  }

  handleDialogOpen = () => {
    this.setState({dialogOpen: true});
  }

  render() {
    let dialogText = '';
    let dialogTitle = '';
    let room = '';
    if(hashHistory.getCurrentLocation().pathname.indexOf('/room') !== -1) {
      room = hashHistory.getCurrentLocation().pathname.split('/')[2];
    }

    const actions = [
      <FlatButton
          label="Ok"
          onTouchTap={this.handleDialogClose}
      />
    ];

    return (
      <div>
        <header>
          <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
            <Paper zDepth={1}>
                <Toolbar style={{backgroundColor: '#262626',}}>
                  <ToolbarGroup>
                    <FlatButton onTouchTap={this.goHome} style={{height: 50, paddingTop: '5px', paddingRight: 10, marginLeft: '-15px'}}>
                      <img style={{float: 'left', width: '50px', height: '50px'}} src={mainIcon} alt="Network by Dmitry Mirolyubov from the Noun Project"/>
                      <span className="flow-text">iRadio</span>
                    </FlatButton>
                    {room && <div className="flow-text">Current room: {room}</div>}
                  </ToolbarGroup>
                  <ToolbarGroup>
                    <IconMenu
                      iconButtonElement={<IconButton style={{marginTop: '-15px'}} disabled={this.state.userHandle ? false : true}>{this.state.userHandle  && <Avatar backgroundColor={'#5C5C5C'} color={'#00E5FF'}>{this.state.userHandle.charAt(0)}</Avatar>}</IconButton>}
                      anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                      targetOrigin={{horizontal: 'right', vertical: 'top'}}
                    >
                      <MenuItem onTouchTap={this.handleDialogOpen} primaryText="Room ID" />
                      <MenuItem onTouchTap={this.signOut} primaryText="Sign out" />
                    </IconMenu>
                  </ToolbarGroup>
                </Toolbar>
            </Paper>
          </MuiThemeProvider>
        </header>
        <main>
          {this.props.children}
          <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
            <Dialog
              title={<div>Room ID: <span style={{color: "#03A9F4"}}>{this.state.userHandle}</span></div>}
              actions={actions}
              modal={false}
              open={this.state.dialogOpen}
              onRequestClose={this.handleDialogClose}>
              Your user handle doubles as your room ID! This is your room ID: <span style={{color: "#03A9F4", fontSize: '1.5rem'}}>{this.state.userHandle}</span> <br/>
              Once you create a room, share with your friends to let them join!
            </Dialog>
          </MuiThemeProvider>
        </main>
        <footer>

        </footer>
      </div>
    );
  }
}

export default App;
