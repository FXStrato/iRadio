import React from 'react';
import _ from 'lodash';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import {List, ListItem, Dialog, FlatButton} from 'material-ui';
import firebase from 'firebase';
import DeleteIcon from 'material-ui/svg-icons/action/delete';

class Queue extends React.Component {
  state = {
    queue: [],
    dialogKey: null,
    dialogTitle: null,
    open: false
  }

  componentWillUnmount = () => {
    this.queueRef.off();
  }

  componentDidMount = () => {
    this.queueRef = firebase.database().ref('channels/' + this.props.room + '/queue');
    this.queueRef.on('value', snapshot => {
      let temp = [];
      snapshot.forEach(childsnap => {
        let item = childsnap.val();
        item.key = childsnap.key;
        temp.push(item);
      });
      this.setState({queue: temp});
    })
  }

  handleOpen = (key, title) => {
    this.setState({dialogKey: key});
    this.setState({dialogTitle: title});
    this.setState({open: true});
  }

  handleClose = () => {
    this.setState({open: false});
  }

  //This function might be causing problems. Not sure though. It still deletes, but queue isn't updating.
  handleDelete = () => {
    let songRef = firebase.database().ref('channels/' + this.props.room + '/queue/' + this.state.dialogKey);
    songRef.remove();
    songRef.off();
    this.setState({open: false});
  }

  render() {
    let songList = _.map(this.state.queue, (song, index) => {
      return (
          <ListItem
            style={{overflow: 'hidden', backgroundColor: '#1F1F1F', border: '1px #373737 solid', paddingBottom: '10px'}}
            innerDivStyle={{padding: '0', margin: '10px 10px 0px 0px',}}
            key={song.key}
            leftAvatar={<img className="responsive-img" style={{position: 'none', float: 'left', marginLeft: '10px', marginRight: '10px', width: '120px'}} src={song.thumbnail} alt={song.title}/>}
            rightIcon={this.props.user && <DeleteIcon style={{cursor: 'pointer', marginTop: '20px'}} onTouchTap={() => this.handleOpen(song.key, song.title)} color={'#C2185B'} />}
            primaryText={<div style={{paddingTop: '20px', paddingRight: '50px', color:'white'}}>{song.title}</div>}
            secondaryText={<div style={{color:'white'}}>{song.channel} | {song.formatduration}</div>}
          />);
    });

    const actions = [
      <FlatButton
          label="Cancel"
          onTouchTap={this.handleClose}
      />,
      <FlatButton
          label={'Remove Song From Queue'}
          onTouchTap={this.handleDelete}
      />
    ];

  return (
      <div>
        {this.state.queue.length < 1 &&
        <div className="center-align">Nothing In Queue</div>
        }
        <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
        <List>
          {songList}
        </List>
        </MuiThemeProvider>
        <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
           <Dialog
           title={'Deleting Song From Queue'.toUpperCase()}
           actions={actions}
           modal={false}
           open={this.state.open}>
           Are you sure you wish to remove {this.state.dialogTitle} from the queue? <br/> {this.state.dialogKey}
           </Dialog>
         </MuiThemeProvider>
      </div>
    );
  }
}

export default Queue;
