import React from 'react';
import ReactPlayer from 'react-player';
import {IconButton, FontIcon} from 'material-ui';
import 'font-awesome/css/font-awesome.css';
import injectTapEventPlugin from 'react-tap-event-plugin';
//fix an onTapEvent issue with react
injectTapEventPlugin();


var sampleTracks =
  {
    "id" : {
      "url": "https://www.youtube.com/watch?v=Ug_9iMuuCjs"
    },
    "kek" : {
      "url": "https://www.youtube.com/watch?v=Nuko3Vcq4eI"
    },
    "lol" : {
      "url": "https://www.youtube.com/watch?v=TD2UsE3Lfdc"
    }
  }


class RadioPlayer extends React.Component {

  constructor(props) {
    super(props);
    this.state =
      {
        isPlaying: false,
        nowPlaying: "https://www.youtube.com/watch?v=Zasx9hjo4WY",
        tracks: [
          "https://www.youtube.com/watch?v=Ug_9iMuuCjs",
          "https://www.youtube.com/watch?v=Nuko3Vcq4eI",
          "https://www.youtube.com/watch?v=TD2UsE3Lfdc"
        ],
        played: 0
      };
  }

  handlePlayPauseClick = () => {
    console.log("I've been clicked! -- Play Pause");
    //TODO toggle the classNames so that 'fa fa-pause' is the new classname
    var togglePlaying = !this.state.isPlaying;
    this.setState({isPlaying: togglePlaying});
  }

  handleForwardClick = () => {
    console.log("I've been clicked! -- Forward");
    var newNowPlaying = this.state.tracks[0];
    var shiftedTracks = this.state.tracks;
    shiftedTracks.shift();
    var newState = {
      nowPlaying: newNowPlaying,
      tracks: shiftedTracks
    };
    this.setState(newState);
  }

  handleBackwardClick = () => {
    console.log("I've been clicked! -- Backward");
    //TODO let's implement this last
  }

  handleRepeatClick = () => {
    var toggleRepeating = !this.state.isRepeating;
    this.setState({loop:toggleRepeating});
  }

  onProgress = state => {
    // We only want to update time slider if we are not currently seeking
    if (!this.state.seeking) {
      console.log("progress");
      console.log(state);
      this.setState(state);
    }
  }

  onDuration = state => {
    // We only want to update time slider if we are not currently seeking
    if (!this.state.seeking) {
      console.log("duration:");
      console.log(state);
    }
  }

  render() {
    return (
      <div>
        <VideoContainer
          onProgress={this.onProgress}
          onDuration={this.onDuration}
          playing={this.state.isPlaying}
          nowPlaying={this.state.nowPlaying}
          loop={true}
        />
        <PlaybackControls
          playPauseCallback={this.handlePlayPauseClick}
          forwardCallback={this.handleForwardClick}
          backwardCallback={this.handleBackwardClick}
          repeatCallback={this.handleRepeatClick}
        />
      </div>
    )

  }
}
/*
 https://www.youtube.com/watch?v=Ug_9iMuuCjs
 https://www.youtube.com/watch?v=Nuko3Vcq4eI
 https://www.youtube.com/watch?v=TD2UsE3Lfdc


*/

//this cna be later for playback speed
class VideoContainer extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    var url = this.props.nowPlaying;
    var urlWithTimestamp = ''; // set the url with the timestamp
    var kek = '';

    //TODO call the firebase and get the data
    return (
      <ReactPlayer
        playing={this.props.playing}
        url={url}
        onProgress={this.props.onProgress}
        onDuration={this.props.onDuration}
        progressFrequency={1000}
        loop={this.props.loop}
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
      color: "#000000",
    };

    const iconClasses =
      {
        backward: {
          name: "backward",
          className: "fa fa-step-backward",
          callback: this.props.backwardCallback
        },
        play : {
          name: "play",
          className: "fa fa-play",
          callback: this.props.playPauseCallback
        },
        forward : {
          name: "forward",
          className: "fa fa-step-forward",
          callback: this.props.forwardCallback
        },
        repeat : {
          name: "repeat",
          className: "fa fa-repeat",
          callback: this.props.repeatCallback
        }
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
      </div>
    );
  }

}

export default RadioPlayer;