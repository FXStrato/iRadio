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
    this.queueRef.off();
  }

  componentDidMount = () => {
    this.queueRef = firebase.database().ref('channels/' + this.props.room + '/' + this.props.listType).orderByChild('insertTime');
    this.queueRef.on('value', snapshot => {
      let temp = [];
      snapshot.forEach(childsnap => {
        let item = childsnap.val();
        item.key = childsnap.key;
        temp.push(item);
      });
      if(this.props.listType === 'queue') {
        this.setState({queue: temp});
      } else {
        this.setState({queue: _.reverse(temp)})
      }

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
    let isQueue = false;
    if(this.props.listType === 'queue') {
      isQueue = true;
    }
    let songList = _.map(this.state.queue, (song, index) => {
      var content = '';
      content = <ListItem
        style={{overflow: 'hidden', backgroundColor: '#1F1F1F', border: '1px #373737 solid', paddingBottom: '10px'}}
        innerDivStyle={{padding: '0', margin: '10px 10px 0px 0px',}}
        key={song.key}
        leftAvatar={<img className="responsive-img" style={{position: 'none', float: 'left', marginLeft: '10px', marginRight: '10px', width: '120px'}} src={song.thumbnail} alt={song.title}/>}
        rightIcon={this.props.isOwner ? <DeleteIcon style={{cursor: 'pointer', marginTop: '20px'}} onTouchTap={() => this.handleOpen(song.key, song.title)} color={'#C2185B'} />: <div></div>}
        primaryText={<div style={{paddingTop: '20px', paddingRight: '50px', color:'white'}}>{song.title}</div>}
        secondaryText={<div style={{color:'white'}}>{song.channel} | {song.formatduration}</div>}
      />;
      return content;
    });

    const actions = [
      <FlatButton
          label="Cancel"
          onTouchTap={this.handleClose}
      />,
      <FlatButton
          label={isQueue ? 'Remove Song From Queue' : 'Remove Song From History'}
          onTouchTap={this.handleDelete}
      />
    ];

  return (
      <div>
        {this.state.queue.length < 1 &&
        <div className="center-align">Nothing In {isQueue ? 'Queue' : 'History'}</div>
        }
        <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
        <List>
          {songList}
        </List>
        </MuiThemeProvider>
        <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
           <Dialog
           title={isQueue ? 'Deleting Song From Queue'.toUpperCase() : 'Deleting Song From History'.toUpperCase()}
           actions={actions}
           modal={false}
           open={this.state.open}>
           Are you sure you wish to remove {this.state.dialogTitle} from {isQueue ? 'queue' : 'history'}?
           </Dialog>
         </MuiThemeProvider>
      </div>
    );
  }
}

export default SongList;
