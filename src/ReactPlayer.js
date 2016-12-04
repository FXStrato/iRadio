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
        nowPlaying: {
          // isPlaying: false,
          // url: "",
          // progress: 0,
          // duration: 200
        },
        tracks: [],
        volume: 0.75
      };
  }

  componentDidMount() {

    firebase.auth().signInWithEmailAndPassword("evan@test.com", "123123")
      .catch((err) => console.log(err));
    //var channelId = this.props.channelId;
    let channelId = "evanTest";
    let refPath = "channels/" + channelId;

    //TODO break this up into tracks ref and queue ref and do the things necessary for each

    let thisChannelRef = firebase.database().ref(refPath);

    thisChannelRef.on("value", (snapshot) => {
      let queueInstance = snapshot.child("queue").val();
      let nowPlayingInstance = snapshot.child("nowPlaying").val();
      let roomQueue = [];
      for(let track in queueInstance) {
        roomQueue.push(queueInstance[track]);
      }
      this.setState({tracks:roomQueue, nowPlaying:nowPlayingInstance});
    });



  }

  handlePlayPauseClick = () => {
    console.log("I've been clicked! -- Play Pause");
    //TODO toggle the classNames so that 'fa fa-pause' is the new classname
    let togglePlaying = !this.state.isPlaying;
    //update firebase instead of state here
    this.setState({isPlaying: togglePlaying});
  };

  handleForwardClick = () => {
    console.log("I've been clicked! -- Forward");
    let shiftedTracks = this.state.tracks;
    if(this.state.isLooping) {
      shiftedTracks.unshift(this.state.nowPlaying.url);
    }
    let newUrl = this.state.tracks[0].url;
    shiftedTracks.shift();
    let newState = {
      url: newUrl,
      tracks: shiftedTracks
    };
    //update firebase instead of state here
    this.setState(newState);
  };

  handleBackwardClick = () => {
    console.log("I've been clicked! -- Backward");
    //TODO let's implement this last
  };

  handleLoopClick = () => {
    let toggleLooping = !this.state.isLooping;
    //TODO update firebase instead of state here
    this.setState({isLooping:toggleLooping});
  };

  onProgress = state => {
    // We only want to update time slider if we are not currently seeking
    if (!this.state.seeking) {
      console.log(state);
      if(state.hasOwnProperty("played")){
        var newNowPlayingState = this.state.nowPlaying;
        newNowPlayingState.progress = state["played"];
        //TODO update firebase instead of state here
        //this.setState({nowPlaying:newNowPlayingState});
      }
    }
  };

  onVideoEnd = () => {
    this.handleForwardClick();
  };

  handleVolumeChange = (e, value) => {
    this.setState({volume:value});
  };

  onDuration = state => {
    // We only want to update time slider if we are not currently seeking
    if (!this.state.seeking) {
      this.setState({duration:state});
    }
  };

  render() {

    return (
      <div>
        <VideoContainer
          onProgress={this.onProgress}
          onDuration={this.onDuration}
          onVideoEnd={this.onVideoEnd}
          playing={this.state.isPlaying}
          url={this.state.nowPlaying.url}
          loop={this.state.nowPlaying.isLooping}
          progress={this.state.nowPlaying.progress}
          duration={this.state.nowPlaying.duration}
          volume={this.state.volume}
        />
        <PlaybackControls
          playPauseCallback={this.handlePlayPauseClick}
          forwardCallback={this.handleForwardClick}
          backwardCallback={this.handleBackwardClick}
          loopCallback={this.handleLoopClick}
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
    let timeElapsed = this.props.duration * this.props.progress;
    let timeElapsedQueryUpdate = this.convertToYoutubeTimestamp(timeElapsed);
    this.setState({timeElapsedQuery:timeElapsedQueryUpdate})
  }

  //converts a time elapsed timestamp to a query string recognized by youtube
  convertToYoutubeTimestamp(timeElapsed) {
    console.log("time elapsed");
    console.log(timeElapsed);
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
    let timeElapsedQuery = this.convertToYoutubeTimestamp(this.props.progress * this.props.duration);
    let url = this.props.url + timeElapsedQuery;
    console.log(url);
    return (
      <ReactPlayer
        playing={this.props.playing}
        url={url}
        onProgress={this.props.onProgress}
        onDuration={this.props.onDuration}
        onEnded={this.props.onVideoEnd}
        progressFrequency={1000}
        played={this.props.progress}
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