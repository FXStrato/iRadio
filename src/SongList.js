import React from 'react';
import _ from 'lodash';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {List, ListItem} from 'material-ui';
import firebase from 'firebase';

class Queue extends React.Component {
  constructor(props){
    super(props);
    this.state = {queue : []};
  }

  componentDidMount() {
    let queueRef = firebase.database().ref('channels/' + this.props.room + '/queue');
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

  render(){
    var songList = this.state.queue.map(function(song){
      return (
          <ListItem 
            style={{overflow: 'hidden'}}
            innerDivStyle={{padding: '0', margin: '10px 10px 0px 0px',}}
            key={song.url}
            leftAvatar={<img className="responsive-img" style={{position: 'none', marginRight: '10px', width: '120px'}} src={song.thumbnail} alt={song.title}/>}
            primaryText={<div style={{paddingTop: '20px', paddingRight: '50px', color:'white'}}>{song.title}</div>}   
            secondaryText={<div style={{color:'white'}}>{song.channel} | {song.formatduration}</div>}         
          />
      )
    })

  return (
    <div>
      {this.state.queue &&
        <h2>Up to Next...</h2>
      }
      {!this.state.queue &&
      <h2> The queue right now is Empty</h2>
      }
      <MuiThemeProvider muiTheme={getMuiTheme()}>
      <List>
        {songList} 
      </List>
      </MuiThemeProvider>
    </div>
  )
  }
} 
export {Queue}
export default Queue;