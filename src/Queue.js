import React from 'react';
import _ from 'lodash';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import {List, ListItem, Dialog, FlatButton} from 'material-ui';
import firebase from 'firebase';
import DeleteIcon from 'material-ui/svg-icons/action/delete';

class SongList extends React.Component {
  state = {
    queue: [],
    dialogKey: null,
    dialogTitle: null,
    open: false
  }

  componentWillUnmount = () => {
    this.off();
  }

  componentDidMount = () => {
    //this listener might not actually be working totally upon tab switch. Need to check this
    this.queueRef = firebase.database().ref('channels/' + this.props.room + '/' + this.props.listType);
    this.queueRef.on('value', snapshot => {
      let temp = [];
      snapshot.forEach(childsnap => {
        let item = childsnap.val();
        item.key = childsnap.key;
        temp.push(item);
      });
      this.setState({queue: temp});
    })
    //Temporary, trying to locate bug
    this.queueRef.on('child_added', snapshot => {
    })
    this.queueRef.on('child_removed', snapshot => {
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
    let songRef = firebase.database().ref('channels/' + this.props.room + '/' + this.props.listType + '/' + this.state.dialogKey);
    songRef.remove();
    songRef.off();
    this.setState({open: false});
  }

  render() {
    let songList = _.map(this.state.queue, (song, index) => {

      var content = '';
      if(this.props.listType === 'queue') {
        content = <ListItem
          style={{overflow: 'hidden'}}
          innerDivStyle={{padding: '0', margin: '10px 10px 0px 0px',}}
          key={song.key}
          leftAvatar={<img className="responsive-img" style={{position: 'none', float: 'left', marginRight: '10px', width: '120px'}} src={song.thumbnail} alt={song.title}/>}
          rightIcon={<DeleteIcon style={{cursor: 'pointer'}} onTouchTap={() => this.handleOpen(song.key, song.title)} color={'#C2185B'} />}
          primaryText={<div style={{paddingTop: '20px', paddingRight: '50px', color:'white'}}>{song.title}</div>}
          secondaryText={<div style={{color:'white'}}>{song.channel} | {song.formatduration}</div>}
        />;
      } else {
        content = <ListItem
          style={{overflow: 'hidden'}}
          innerDivStyle={{padding: '0', margin: '10px 10px 0px 0px',}}
          key={song.key}
          leftAvatar={<img className="responsive-img" style={{position: 'none', float: 'left', marginRight: '10px', width: '120px'}} src={song.thumbnail} alt={song.title}/>}
          primaryText={<div style={{paddingTop: '20px', paddingRight: '50px', color:'white'}}>{song.title}</div>}
          secondaryText={<div style={{color:'white'}}>{song.channel} | {song.formatduration}</div>}
        />;
      }

      return content;
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
        {!this.state.queue &&
        <h2>Nothing in Queue</h2>
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

export default SongList;
