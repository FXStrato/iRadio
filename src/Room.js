import React from 'react';
import firebase from 'firebase';

class Room extends React.Component{
  constructor(props){
    super(props);
  }


  render(){
    var user = firebase.auth().currentUser;
    console.log('user', user);
    if(user){
      console.log('YEAH');
      var nowPlaying = {
        duration:'',
        isPlaying:false,
        progress:'',
        title:'',
        url:''
      }
      console.log('nowPlaying', nowPlaying);
      var roomRef = firebase.database().ref("room/" + this.props.params.roomName + "/NowPlaying")
      roomRef.push(nowPlaying);
    }
    console.log('room', this.props.params.roomName);
    //console.log('user', firebase.auth().currentUser.uid);
    return(
      <div className="input">
        <h3>Begin your Music Jounery</h3>
        <h4>{this.props.params.roomName} Room</h4>
      </div>
    )
  }
}

class CreateRoom extends React.Component{
  render(){
    return(
      <div>
      <p>hello</p>
      </div>
    )
  }
}

export default Room;

/*
firebase.auth().onAuthStateChanged((user) => {
  if(user){
    var nowPlaying = {
      duration:'',
      isPlaying:false,
      progress:'',
      title:'',
      url:''
    }
    var roomRef = firebase.database().ref("room/" + this.props.params.roomName)
    roomRef.push(nowPlaying);
  }
}

)*/
