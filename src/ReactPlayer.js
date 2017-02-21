import React from 'react';
import ReactPlayer from 'react-player';
import {Slider, BottomNavigation, BottomNavigationItem} from 'material-ui';
import 'font-awesome/css/font-awesome.css';
import firebase from 'firebase';
import PlayIcon from 'material-ui/svg-icons/av/play-arrow';
import PauseIcon from 'material-ui/svg-icons/av/pause';
import ForwardIcon from 'material-ui/svg-icons/av/fast-forward';
import VolumeIcon from 'material-ui/svg-icons/av/volume-up';

//RadioPlayer componenet that has both the video container and the playback controls
class RadioPlayer extends React.Component {

  constructor(props) {
    super(props);
    this.state =
      {
        nowPlaying:null,
        queue:{},
        volume: 0.75,
        isOwner: this.props.isOwner
      };
  }

  componentWillUnmount() {
    //If person leaving is owner, pause everything.
    if(this.props.isOwner && this.state.nowPlaying) {
      let thisState = this.state.nowPlaying;
      if(thisState.isPlaying) {
        thisState.isPlaying = false;
      }
      let nowPlayingRef = firebase.database().ref("channels/" + this.props.room + "/nowPlaying");
      nowPlayingRef.set(thisState);
      nowPlayingRef.off();
    }
    this.auth();
    this.queueRef.off();
    this.nowPlayingRef.off();
    localStorage.removeItem('tempUrl');
    localStorage.setItem('updated', JSON.stringify(false));
  }

  componentDidMount() {

    this.auth = firebase.auth().onAuthStateChanged((user) =>  {
      if(user) {
        this.setState({user:user});
      }
    });

    this.queueRef = firebase.database().ref("channels/" + this.props.room + "/queue");
    this.nowPlayingRef = firebase.database().ref("channels/" + this.props.room + "/nowPlaying");
    this.nowPlayingRef.on('value', (snapshot) => {
      var newNowPlaying = snapshot.val();
      this.setState({nowPlaying:newNowPlaying});
    });
    this.queueRef.on('child_added', (snapshot) => {
      var trackInstance = snapshot.val();
      if(!this.state.nowPlaying) {
        var item = trackInstance;
        item.progress = 0;
        item.isPlaying = true;
        item.baseUrl = trackInstance.url;
        this.nowPlayingRef.set(item);
        this.setState({nowPlaying:item});
        this.queueRef.child(snapshot.key).remove();
      }
    });
  }

  //handles the playing and pausing of the video for the whole room. only admin should have control over thi
  handlePlayPauseClick = () => {
    var thisState = this.state.nowPlaying;
    thisState.isPlaying = !this.state.nowPlaying.isPlaying;
    var nowPlayingRef = firebase.database().ref("channels/" + this.props.room + "/nowPlaying");
    nowPlayingRef.set(thisState);
  };

  //handles the fast forwrd clicking and updates the firebase instance
  handleForwardClick = () => {
    if(this.props.isOwner) {
      var refPath = "channels/" + this.props.room;
      var queueRef = firebase.database().ref(refPath + "/queue");
      var historyRef = firebase.database().ref("channels/" + this.props.room + "/history");
      var nowPlayingRef = firebase.database().ref("channels/" + this.props.room + "/nowPlaying");

      var roomRef = firebase.database().ref(refPath);
      //save the old now playing object
      var oldTrack = {
        url: this.state.nowPlaying.url,
        baseUrl: this.state.nowPlaying.url,
        duration: this.state.nowPlaying.duration,
        formatduration: this.state.nowPlaying.formatduration,
        title: this.state.nowPlaying.title,
        thumbnail: this.state.nowPlaying.thumbnail,
        channel: this.state.nowPlaying.channel,
        insertTime: this.state.nowPlaying.insertTime
      };
      historyRef.push(oldTrack);
    //get the object at the front of the queue
    //This is where it pulls from queue. Only do this if the person is owner.
      var newTrack = null;
      queueRef.orderByKey().limitToFirst(1)
        .once("value", (snapshot) => {
          var newTrackContainer = snapshot.val();
          if(newTrackContainer) {
            for (var track in newTrackContainer) {
              if (newTrackContainer.hasOwnProperty(track)) {
                newTrack = newTrackContainer[track];
                newTrack.key = track;
              }
            }
          }
        });
      if(newTrack) {
        firebase.database().ref(refPath + "/queue/" + newTrack.key).remove();
      }
      //removes the song that was at the front of the queue
      var newQueue = {};
      queueRef.once("value", (snapshot) => {
        newQueue = snapshot.val();
      });
      //update the new now playing object entry
      var newNowPlaying = null;
      if(newTrack) {
        newNowPlaying = {
          url: newTrack.url,
          baseUrl: newTrack.url,
          duration: newTrack.duration,
          formatduration: newTrack.formatduration,
          insertTime: newTrack.insertTime,
          title: newTrack.title,
          thumbnail: newTrack.thumbnail,
          channel: newTrack.channel,
          progress: 0,
          isPlaying: true
        }
      }
      nowPlayingRef.set(newNowPlaying);
      roomRef.child("queue").set(newQueue);
    }
  }


  //updates the state and firebase with each 'onProgress' call made by the react-player to make sure any joining users are up to date with the player
  onProgress = state => {
    //Only have owner updating progress
    if(this.props.isOwner) {
      // We only want to update time slider if we are not currently seeking
      if (!this.state.seeking) {
        if(state.hasOwnProperty("played")){
          if(this.state.nowPlaying.progress - state["played"] > 0.05) {
            this.forceUpdate();
          } else {
            var newNowPlayingState = this.state.nowPlaying;
            newNowPlayingState.progress = state["played"];
            this.setState(newNowPlayingState);
            firebase.database().ref("channels/"+ this.props.room +"/nowPlaying").set(newNowPlayingState);
          }
        }
      }
    }
  };

  //converts a time elapsed value into a valid youtube timestamp
  convertToYoutubeTimestamp = timeElapsed => {
    var radix = 10;
    var hours = "";
    if(timeElapsed > 3600) {
      hours = "" + (parseInt(timeElapsed / 3600, radix)) + "h";
      timeElapsed %= 3600;
    }
    var minutes = "";
    if(timeElapsed > 60) {
      minutes =  "" + parseInt(timeElapsed / 60, radix) + "m";
      timeElapsed %= 60;
    }
    var seconds = "";
    if(timeElapsed !== 0) {
      seconds = "" + parseInt(timeElapsed, radix) + "s";
    }
    if(hours || minutes || seconds) {
      return "&t=" + hours + minutes + seconds;
    } else {
      return "";
    }
  };

  //when the video ends, handles the aciton to take it to the next video
  onVideoEnd = () => {
    this.handleForwardClick();
  };

  //handles a user's changing volume
  handleVolumeChange = (e, value) => {
    this.setState({volume:value});
  };

  //renders the entire video player
  render() {
    var isPlaying = false;
    var title = '';
    var content = <div className="center-align">There are currently no songs queued up!</div>;
    if(this.state.nowPlaying) {

      var updated = JSON.parse(localStorage.getItem("updated"));
      var urlToInput = this.state.nowPlaying.baseUrl;
      var tempUrl = JSON.parse(localStorage.getItem("tempUrl"));
      if(!updated && this.state.nowPlaying.progress) {
        if((tempUrl === null || tempUrl === undefined) ) {
          var timeOfCurrentVideo = this.state.nowPlaying.progress * this.state.nowPlaying.duration;
          tempUrl = this.state.nowPlaying.baseUrl + this.convertToYoutubeTimestamp(timeOfCurrentVideo);
          localStorage.setItem("tempUrl",JSON.stringify(tempUrl));
        }
        urlToInput = tempUrl;
        localStorage.setItem("updated", JSON.stringify(true));
      } else if(tempUrl && tempUrl.startsWith(this.state.nowPlaying.baseUrl)) {
        urlToInput = tempUrl;
      } else {
        localStorage.removeItem("tempUrl");
      }

      content =
        <div className="col l8 offset-l2 offset-m1 m10 s12">
          <VideoContainer
            onProgress={this.onProgress}
            onVideoEnd={this.onVideoEnd}
            url={urlToInput}
            nowPlaying={this.state.nowPlaying}
            volume={this.state.volume}
          />
        </div>
      isPlaying = this.state.nowPlaying.isPlaying;
      title = this.state.nowPlaying.title
    }

    return (
      <div>
        <div className="row">
          {!this.props.isMobile &&
            content
          }
          <div className="col s12 center-align">
            <h1 className="flow-text">{title}</h1>
          </div>
          {this.state.nowPlaying !== null && !this.state.nowPlaying.isPlaying  ?
            <div className="col s12 center-align red-text text-lighten-2">
              Video is currently paused
            </div>
          :
          <div className="col s12 center-align red-text text-lighten-2" style={{visibility: 'hidden'}}>
            Video is currently paused
          </div>}
        </div>
        {this.state.nowPlaying !== null &&
          <div className="row">
            <div className="col s12">
              <PlaybackControls
                isOwner={this.props.isOwner}
                isPlaying={isPlaying}
                playPauseCallback={this.handlePlayPauseClick}
                forwardCallback={this.handleForwardClick}
                backwardCallback={this.handleBackwardClick}
                volumeCallback={this.handleVolumeChange}
              />
            </div>
          </div>
        }
    </div>
    );
  }
}

//Video container that has the playing youtube video for the room
class VideoContainer extends React.Component {

  //renders the video container
  render() {
    return (
      <ReactPlayer
        style={{pointerEvents: 'none'}}
        className="responsive-video, z-depth-1"
        width={'100%'}
        playing={this.props.nowPlaying.isPlaying}
        url={this.props.url}
        onProgress={this.props.onProgress}
        onDuration={this.props.onDuration}
        onEnded={this.props.onVideoEnd}
        progressFrequency={500}
        played={this.props.nowPlaying.progress}
        volume={this.props.volume}
        controls={false}
      />);
  }
}

//Playback controls for the Radio Player
class PlaybackControls extends React.Component {

  select = index => {

  }

  //renders the playback controls
  render() {
    return (
      <div className="row">
        {this.props.isOwner &&
          <div>
            <div className="col s8 offset-s2">
              <BottomNavigation style={{backgroundColor: '#212121'}}>
                <BottomNavigationItem
                  label={!this.props.isPlaying ? "Play" : "Pause"}
                  icon={!this.props.isPlaying ? <PlayIcon hoverColor="#039BE5"/> : <PauseIcon hoverColor="#039BE5"/>}
                  onTouchTap={this.props.playPauseCallback}
                />
                <BottomNavigationItem
                  label="Skip"
                  icon={<ForwardIcon hoverColor="#039BE5"/>}
                  onTouchTap={this.props.forwardCallback}
                />
              </BottomNavigation>
            </div>
          </div>
          }
          {!this.props.isMobile &&
            <div className="col s2 right">
            <VolumeIcon style={{marginTop: -60, float: 'left', opacity: 0.5}}/>
            <Slider
              defaultValue={0.75}
              axis={'y'}
              style={{height: '100px', marginTop: '-55px'}}
              onChange={this.props.volumeCallback}
            />
          </div>
        }

      </div>
    );
  }
}

export default RadioPlayer;
