import React from 'react';
import Search from './Search';
import {hashHistory, Link} from 'react-router';
import {FlatButton, Dialog, RaisedButton, muiTheme, prepareStyles, TextField} from 'material-ui';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';

class Page extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      open:false,
      roomName:''
    };
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleOpen = () => {
    this.setState({open: true});
  };

  handleClose = () => {
    this.setState({open: false});
  };

  handleChange(event){
    var value = event.target.value;
    this.setState({roomName:value});
  }

  goToRoom(){
    console.log('pathhhh',this.state.roomName);
    hashHistory.push('/room/'+ this.state.roomName);
  }

  render(){
    console.log('path',this.state.roomName);
    const actions = [
    <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.handleClose}
    />,
    <FlatButton
        label="Create"
        primary={true}
        onTouchTap={(event) => this.goToRoom(event)}
    />
    ];

    return(
      <div>
      <h1>Welcome to iRadio</h1>
      <p> -- Your personal space to share awesome music and video</p>
          <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
            <RaisedButton label="Create Room" onTouchTap={this.handleOpen} />
          </MuiThemeProvider>
          <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
            <Dialog
            title="Name For U Room"
            actions={actions}
            modal={true}
            open={this.state.open}
            >
              <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
              <TextField
                floatingLabelText="Create Personal Radio room"
                id='text'
                onChange={this.handleChange}
              />
              </MuiThemeProvider>
            </Dialog>
          </MuiThemeProvider>
        <h2 className="center-align">Search</h2>
        </div>
    )
  }
}

export default Page;
