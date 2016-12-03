import React from 'react';
import _ from 'lodash';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {List, ListItem} from 'material-ui';



var SAMPLE_SONGS = [
  {
    name: 'Airwolf - Lose The Lazy ft Stahsi',
    desc: 'song',
    url: 'https://i.ytimg.com/vi/Ug_9iMuuCjs/default.jpg',
    duration:'05:31'
  },
  {
    name: 'Best of Yoga Lin 2016', 
    desc: 'Songs', 
    url:'https://i.ytimg.com/vi/O4TbdbTl7mI/default.jpg',
    duration:'31:48'
  },
  { 
    name: 'Adele - Hello', 
    desc: 'Hello offical MV', 
    url: 'https://i.ytimg.com/vi/YQHsXMglC9A/default.jpg',
    duration:'04:55'
  },
  { 
    name: 'Smoke Filled Room', 
    desc: 'Mako, offical Video', 
    url: 'https://i.ytimg.com/vi/tL1dv6ecRrg/default.jpg',
    duration:'03:28'
  },
  { 
    name: 'stressed out', 
    desc: 'twenty one pilots', 
    url: 'https://i.ytimg.com/vi/pXRviuL6vMY/default.jpg',
    duration:'03:46'
  },
];

class Queue extends React.Component {
  constructor(props){
    super(props);
    this.state = {songs : SAMPLE_SONGS};
  }
  render(){
    //var image = Object.keys(_.groupBy(this.state.songs, 'url'));
    var songUrl = Object.keys(_.groupBy(this.state.songs, 'url'));

    console.log(songUrl);
    var songList = this.state.songs.map(function(item){
      console.log('hi', item.url);
      return (
          <ListItem
            style={{overflow: 'hidden'}}
            innerDivStyle={{padding: '0', margin: '10px 10px 0px 0px',}}
            key={item.url}
            leftAvatar={<img className="responsive-img" style={{position: 'none', float: 'left', marginRight: '10px'}} src={item.url} alt={item.desc}/>}
            primaryText={<div style={{paddingTop: '20px'}}>{item.name}</div>}   
            secondaryText={'channelTitle | ' + item.duration}         
          />
      )
    })

  return (
    <div>
      <h2>Up to Next...</h2>
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