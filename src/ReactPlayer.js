import React from 'react';
import ReactPlayer from 'react-player';
import {IconButton, FontIcon} from 'material-ui';
import 'font-awesome/css/font-awesome.css';
import injectTapEventPlugin from 'react-tap-event-plugin';
//fix an onTapEvent issue with react
injectTapEventPlugin();

class RadioPlayer extends React.Component {

  constructor(props) {
    super(props);
    this.state =
      {
        isPlaying: false,
        localQueue: []

      };
  }


  handlePlayPauseClick(event) {
    console.log("I've been clicked! -- Play Pause");
    //TODO toggle the classNames so that 'fa fa-pause' is the new classname
  }

  handleForwardClick(event) {
    console.log("I've been clicked! -- Forward");
  }

  handleBackwardClick(event) {
    console.log("I've been clicked! -- Backward");
  }

  handleRepeatClick(event) {
    console.log("I've been clicked! -- Repeat");

  }


  togglePlay() {
    var togglePlaying = !this.state.isPlaying;
    this.setState({isPlaying: togglePlaying});
  }

  render() {
    return (
      <div>
        <VideoContainer />
        <PlaybackControls />
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
    var url = 'https://www.youtube.com/watch?v=Ug_9iMuuCjs';
    var urlWithTimestamp = ''; // set the url with the timestamp
    //TODO call the firebase and get the data
    return (
      <ReactPlayer url={url}/>
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

  handlePlayPauseClick(event) {
    console.log("I've been clicked! -- Play Pause");
    //TODO toggle the classNames so that 'fa fa-pause' is the new classname
  }

  handleForwardClick(event) {
    console.log("I've been clicked! -- Forward");
  }

  handleBackwardClick(event) {
    console.log("I've been clicked! -- Backward");
  }

  handleRepeatClick(event) {
    console.log("I've been clicked! -- Repeat");

  }

  render() {

    const iconStyle = {
      color: "#000000",
    };

    const iconClasses =
      {
        backward: {
          name: "backward",
          className: "fa fa-step-backward",
          callback: this.handleBackwardClick
        },
        play : {
          name: "play",
          className: "fa fa-play",
          callback: this.handlePlayPauseClick
        },
        forward : {
          name: "forward",
          className: "fa fa-step-forward",
          callback: this.handleForwardClick
        },
        repeat : {
          name: "repeat",
          className: "fa fa-repeat",
          callback: this.handleRepeatClick
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