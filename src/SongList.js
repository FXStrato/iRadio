import React from 'react';
import _ from 'lodash';
import {Col} from 'react-materialize';
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
    open: false,
    deleteOpen: false
  }

  //TODO: Given time, refactor to only use one dialog based on state

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

  handleDeleteOpen = () => {
    this.setState({deleteOpen: true});
  }

  handleAllDelete = () => {
    let songRef = firebase.database().ref('channels/' + this.props.room + '/' + this.props.listType);
    songRef.set(null);
    songRef.off();
    this.setState({deleteOpen: false});
  }

  handleDeleteClose = () => {
    this.setState({deleteOpen: false});
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

    const deleteActions = [
      <FlatButton
          label="Cancel"
          onTouchTap={this.handleDeleteClose}
      />,
      <FlatButton
          label={isQueue ? 'Remove All Songs From Queue' : 'Remove All Songs From History'}
          onTouchTap={this.handleAllDelete}
      />
    ];

  return (
      <div>
        {this.state.queue.length < 1 &&
        <div className="center-align">Nothing In {isQueue ? 'Queue' : 'History'}</div>
        }
        {this.state.queue.length >= 2 &&
          <Col s={12}>
            <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
              <FlatButton style={{float: 'right'}} backgroundColor={'#C2185B'} label="Delete All" onTouchTap={this.handleDeleteOpen}/>
            </MuiThemeProvider>
          </Col>
        }
        <Col s={12}>
          <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
          <List>
            {songList}
          </List>
          </MuiThemeProvider>
        </Col>
        <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
           <Dialog
           title={isQueue ? 'Deleting Song From Queue'.toUpperCase() : 'Deleting Song From History'.toUpperCase()}
           actions={actions}
           modal={false}
           open={this.state.open}
           onRequestClose={this.handleClose}>
           Are you sure you wish to remove {this.state.dialogTitle} from {isQueue ? 'queue' : 'history'}?
           </Dialog>
         </MuiThemeProvider>
         <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
            <Dialog
            title={isQueue ? 'Deleting All From Queue'.toUpperCase() : 'Deleting Song All History'.toUpperCase()}
            actions={deleteActions}
            modal={false}
            open={this.state.deleteOpen}
            onRequestClose={this.handleDeleteClose}>
            Are you sure you wish to remove all songs from {isQueue ? 'queue' : 'history'}?
            </Dialog>
          </MuiThemeProvider>
      </div>
    );
  }
}

export default SongList;
