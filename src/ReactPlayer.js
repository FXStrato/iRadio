import React from 'react';
import ReactPlayer from 'react-player';
import {IconButton, Slider} from 'material-ui';
import 'font-awesome/css/font-awesome.css';
import injectTapEventPlugin from 'react-tap-event-plugin';
import firebase from 'firebase';
//fix an onTapEvent issue with react
injectTapEventPlugin();

//RadioPlayer componenet that has both the video container and the playback controls
class RadioPlayer extends React.Component {

  constructor(props) {
    super(props);
    this.state =
      {
        nowPlaying:{
        },
        queue:{},
        volume: 0.75
      };
  }

  componentDidMount() {

    firebase.auth().signInWithEmailAndPassword("evan@test.com", "123123")
      .catch((err) => console.log(err));
    var channelId = this.props.params.roomID;
    let refPath = "channels/" + channelId;

    let channelRef = firebase.database().ref(refPath);
    channelRef.on("value", (snapshot) => {
      var channelObject = snapshot.val();
      let queueInstance = channelObject.queue;
      for(let track in queueInstance) {
        queueInstance[track].key = track;
      }
      var newState = this.state;
      newState.queue = queueInstance;
      let nowPlayingInstance = channelObject.nowPlaying;
      newState.nowPlaying = nowPlayingInstance;
      this.setState(newState);
    })
  }

  //handles the playing and pausing of the video for the whole room. only admin should have control over thi
  handlePlayPauseClick = () => {
    //TODO toggle the classNames so that 'fa fa-pause' is the new classname
    var thisState = this.state.nowPlaying;
    thisState.isPlaying = !this.state.nowPlaying.isPlaying;
    var nowPlayingRef = firebase.database().ref("channels/" + this.props.params.roomID + "/nowPlaying");
    nowPlayingRef.set(thisState);
  };

  //handles the fast forwrd clicking and updates the firebase instance
  handleForwardClick = () => {
    var refPath = "channels/" + this.props.params.roomID;
    var queueRef = firebase.database().ref(refPath + "/queue");
    var newTrack = {};
    queueRef.orderByKey().limitToFirst(1)
      .once("value", (snapshot) => {
        var newTrackContainer = snapshot.val();
        for (var track in newTrackContainer) {
          newTrack = newTrackContainer[track];
          newTrack.key = track;
        }
      });

    //removes the child
    firebase.database().ref(refPath + "/queue/" + newTrack.key).remove();
    var newQueue = {};
    queueRef.once("value", (snapshot) => {
      newQueue = snapshot.val();
    });

    var newNowPlaying = {
        url: newTrack.url,
        baseUrl: newTrack.url,
        duration: newTrack.duration,
        progress: 0,
        isPlaying: true,
        title: newTrack.title
      };

    var nowPlayingRef = firebase.database().ref(refPath );
    nowPlayingRef.child("nowPlaying").set(newNowPlaying);
  };

  //for now, resets the queue
  handleBackwardClick = () => {
    //TODO let's implement this last

    var reset = {
      key: "evanTest",
      nowPlaying: {
        baseUrl: "https://www.youtube.com/watch?v=phn2JZ2xTz4",
        url: "https://www.youtube.com/watch?v=phn2JZ2xTz4",
        duration: 241,
        title: "save our souls",
        progress:0,
        isPlaying:true
      },
      queue: {
        songId1: {
          url: "https://www.youtube.com/watch?v=Zasx9hjo4WY",
          title: "zedd ignite",
          duration: 227
        },
        songId2: {
          url: "https://www.youtube.com/watch?v=B7xai5u_tnk",
          title: "fatrat monody",
          duration: 290
        },
        songId3: {
          url: "https://www.youtube.com/watch?v=dXHVuIqGzSU",
          title: "aftergold big wild",
          duration: 230
        }
      }
    };

    var queueRef = firebase.database().ref("channels/" + this.props.params.roomID);
    queueRef.set(reset);

  };

  // handleLoopClick = () => {
  //   let toggleLooping = !this.state.isLooping;
  //   //TODO update firebase instead of state here
  //   this.setState({isLooping:toggleLooping});
  // };

  //updates the state and firebase with each 'onProgress' call made by the react-player to make sure any joining users are up to date with the player
  onProgress = state => {
    // We only want to update time slider if we are not currently seeking
    if (!this.state.seeking) {
      if(state.hasOwnProperty("played")){
        if(this.state.nowPlaying.progress - state["played"] > 0.05) {
          this.forceUpdate();
        } else {
          var newNowPlayingState = this.state.nowPlaying;
          newNowPlayingState.progress = state["played"];
          this.setState(newNowPlayingState);
          firebase.database().ref("channels/"+ this.props.params.roomID +"/nowPlaying").set(newNowPlayingState);
        }
      }
    }
  };

  //converts a time elapsed value into a valid youtube timestamp
  convertToYoutubeTimestamp = timeElapsed => {
    var hours = "";
    if(timeElapsed > 3600) {
      hours = "" + (parseInt(timeElapsed / 3600)) + "h";
      timeElapsed %= 3600;
    }
    var minutes = "";
    if(timeElapsed > 60) {
      minutes =  "" + parseInt(timeElapsed / 60) + "m";
      timeElapsed %= 60;
    }
    var seconds = "";
    if(timeElapsed !== 0) {
      seconds = "" + parseInt(timeElapsed) + "s";
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
    return (
      <div>
        <VideoContainer
          onProgress={this.onProgress}
          onVideoEnd={this.onVideoEnd}
          url={urlToInput}
          nowPlaying={this.state.nowPlaying}
          volume={this.state.volume}
        />
        <h1>{this.state.nowPlaying.title}</h1>
        <span>{this.state.nowPlaying.duration}</span>
        <PlaybackControls
          playPauseCallback={this.handlePlayPauseClick}
          forwardCallback={this.handleForwardClick}
          backwardCallback={this.handleBackwardClick}
          volumeCallback={this.handleVolumeChange}
        />
      </div>
    )
  }
}

//Video container that has the playing youtube video for the room
class VideoContainer extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      timeElapsedQuery: ""
    }
  }

  //converts a time elapsed timestamp to a query string recognized by youtube
  convertToYoutubeTimestamp(timeElapsed) {
    var hours = "";
    if(timeElapsed > 3600) {
      hours = "" + (parseInt(timeElapsed / 3600)) + "h";
      timeElapsed %= 3600;
    }
    var minutes = "";
    if(timeElapsed > 60) {
      minutes =  "" + parseInt(timeElapsed / 60) + "m";
      timeElapsed %= 60;
    }
    var seconds = "";
    if(timeElapsed !== 0) {
      seconds = "" + parseInt(timeElapsed) + "s";
    }
    if(hours || minutes || seconds) {
      return "&t=" + hours + minutes + seconds;
    } else {
      return "";
    }
  }

  //renders the video container
  render() {
    return (
      <ReactPlayer
        playing={this.props.nowPlaying.isPlaying}
        url={this.props.url}
        onProgress={this.props.onProgress}
        onDuration={this.props.onDuration}
        onEnded={this.props.onVideoEnd}
        progressFrequency={500}
        played={this.props.nowPlaying.progress}
        volume={this.props.volume}
        controls={false}
      />
    );
  }
}

//Playback controls for the Radio Player
class PlaybackControls extends React.Component {
  constructor(props) {
    super(props);
  }

  //renders the playback controls
  render() {

    const iconStyle = {
      color: "#00B4D2",
      backgroundColor: "#303030"
    };

    const iconClasses =
      {
        backward: {
          name: "backward",
          className: "fa fa-step-backward playback-click",
          callback: this.props.backwardCallback
        },
        play : {
          name: "play",
          className: "fa fa-play playback-click",
          callback: this.props.playPauseCallback
        },
        forward : {
          name: "forward",
          className: "fa fa-step-forward playback-click",
          callback: this.props.forwardCallback
        }
        // loop : {
        //   name: "loop",
        //   className: "fa fa-repeat playback-click",
        //   callback: this.props.loopCallback
        // }
      };

    var iconButtons = [];

    for(var iconClass in iconClasses) {
      var iconButton =
        <IconButton
          key={iconClasses[iconClass].name}
          onClick={ iconClasses[iconClass].callback }
          iconClassName={iconClasses[iconClass].className}
          style={iconStyle}
        />;
        iconButtons.push(iconButton);
    }
    return (
      <div>
        {iconButtons}
        <Slider
          defaultValue={0.75}
          onChange={this.props.volumeCallback}
        />
      </div>
    );
  }
}

export default RadioPlayer;