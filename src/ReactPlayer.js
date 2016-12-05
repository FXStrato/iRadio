import React from 'react';
import ReactPlayer from 'react-player';
import {IconButton, Slider} from 'material-ui';
import 'font-awesome/css/font-awesome.css';
import injectTapEventPlugin from 'react-tap-event-plugin';
import firebase from 'firebase';
//fix an onTapEvent issue with react
injectTapEventPlugin();



//eventually we're going to want to change all of the setStates to save to Firebase refs
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
    //var channelId = this.props.channelId;
    let channelId = "evanTest";
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

  handlePlayPauseClick = () => {
    console.log("I've been clicked! -- Play Pause");
    //TODO toggle the classNames so that 'fa fa-pause' is the new classname
    var thisState = this.state.nowPlaying;
    thisState.isPlaying = !this.state.nowPlaying.isPlaying;
    var nowPlayingRef = firebase.database().ref("channels/evanTest/nowPlaying");
    nowPlayingRef.set(thisState);
  };

  handleForwardClick = () => {

    this.localUrl = null;

    var refPath = "channels/evanTest";
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

  handleBackwardClick = () => {
    console.log("I've been clicked! -- Backward");
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
    }

    var queueRef = firebase.database().ref("channels/evanTest");
    queueRef.set(reset);

  };

  // handleLoopClick = () => {
  //   let toggleLooping = !this.state.isLooping;
  //   //TODO update firebase instead of state here
  //   this.setState({isLooping:toggleLooping});
  // };

  onProgress = state => {
    // We only want to update time slider if we are not currently seeking
    if (!this.state.seeking) {
      console.log(state);
      if(state.hasOwnProperty("played")){
        if(this.state.nowPlaying.progress - state["played"] > 0.05) {
          console.log("I'm behind!");
          this.forceUpdate();

        } else {
          console.log("I'm the leader!");
          var newNowPlayingState = this.state.nowPlaying;
          newNowPlayingState.progress = state["played"];
          this.setState(newNowPlayingState);
          firebase.database().ref("channels/evanTest/nowPlaying").set(newNowPlayingState);
        }

      }
    }
  };

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

  onVideoEnd = () => {
    this.handleForwardClick();
  };

  handleVolumeChange = (e, value) => {
    //this.setState({volume:value});
  };

  onDuration = state => {
    // We only want to update time slider if we are not currently seeking
    // if (!this.state.seeking) {
    //   this.setState({duration:state});
    // }
  };

  render() {
    var updated = JSON.parse(localStorage.getItem("updated"));

    var urlToInput = this.state.nowPlaying.baseUrl;
    var tempUrl = JSON.parse(localStorage.getItem("tempUrl"));

    if(!updated && this.state.nowPlaying.progress) {
      console.log(tempUrl);
      if((tempUrl === null || tempUrl === undefined) ) {
        var timeOfCurrentVideo = this.state.nowPlaying.progress * this.state.nowPlaying.duration;
        tempUrl = this.state.nowPlaying.baseUrl + this.convertToYoutubeTimestamp(timeOfCurrentVideo);
        localStorage.setItem("tempUrl",JSON.stringify(tempUrl));
      }
      urlToInput = tempUrl;
      localStorage.setItem("updated", JSON.stringify(true));
    } else if(tempUrl) {
      urlToInput = tempUrl;
    }
    console.log(urlToInput);

    return (
      <div>
        <VideoContainer
          onProgress={this.onProgress}
          onDuration={this.onDuration}
          onVideoEnd={this.onVideoEnd}
          url={urlToInput}
          nowPlaying={this.state.nowPlaying}
          volume={this.state.volume}
        />
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

//this cna be later for playback speed
class VideoContainer extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      timeElapsedQuery: ""
    }
  }

  componentDidMount() {
    // let timeElapsed = this.props.nowPlaying.duration * this.props.nowPlaying.progress;
    // console.log(this.props.nowPlaying.duration);
    // console.log(this.props.nowPlaying.progress);
    // let timeElapsedQueryUpdate = this.convertToYoutubeTimestamp(timeElapsed);
    // console.log(timeElapsedQueryUpdate);
    // this.setState({timeElapsedQuery:timeElapsedQueryUpdate})
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
        controls={true}
      />
    );
  }
}


class PlaybackControls extends React.Component {
  constructor(props) {
    super(props);
  }

  /*
   play
   pause
   step-backward
   step-forward

   volume-up
   volume-down
   volume-off
   */
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