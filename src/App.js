/*eslint no-unused-vars: "off"*/ //don't show warnings for unused
import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Queue from './SongList';
import {Row, Col} from 'react-materialize';
import {RaisedButton, FlatButton, Dialog, TextField, List, ListItem, AppBar} from 'material-ui';
import _ from 'lodash';
import Search from './Search';
import ytDurationFormat from 'youtube-duration-format';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

const ytURL = 'https://www.youtube.com/watch?v=';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      results: [],
      durations: []
    };
    this.searchCallback = this.searchCallback.bind(this);
    this.handleSearchSelect = this.handleSearchSelect.bind(this);
  }

  //This gets called upon clicking a list item. Can add more parameters to pass in more things.
  handleSearchSelect = elem => {
    console.log(ytURL + elem);
  }

  //Search callback. Assigns results and durations to state.
  searchCallback = (results, durations) => {
    this.setState({results: results});
    console.log('results', results);
    this.setState({durations: []});
    for(let i = 0; i < durations.length; i++) {
      durations[i].then(data => {
        let temp = this.state.durations;
        temp.push(ytDurationFormat(data.items[0].contentDetails.duration));
        this.setState({durations: temp});
      });
    }
  }

  render() {

    //Renders search results. Durations will render when they are ready, maybe should have them not clickable until durations are shown to make sure durations
    //can be passed in as well to onTouchTap
    let content = _.map(this.state.results, (elem, index) => {
      return <ListItem
        onTouchTap={() => this.handleSearchSelect(elem.id.videoId)}
        style={{overflow: 'hidden'}}
        innerDivStyle={{padding: '0', margin: '10px 10px 0px 0px',}}
        key={elem.id.videoId}
        leftAvatar={<img className="responsive-img" style={{position: 'none', float: 'left', marginRight: '10px'}} src={elem.snippet.thumbnails.default.url} alt={elem.id.videoId}/>}
        primaryText={<div style={{paddingTop: '20px'}}>{elem.snippet.title}</div>}
        secondaryText={this.state.durations[index] ? elem.snippet.channelTitle + ' | ' + this.state.durations[index] : elem.snippet.channelTitle + ' | Loading...'}
        secondaryTextLines={2}
      />
    });

    return (
      <div>
        <header>
          <MuiThemeProvider muiTheme={getMuiTheme()}>
          <AppBar title="Title"/>
        </MuiThemeProvider>
        </header>
        <main className="container">
          <Row>
            <Col s={12} m={12} l={6}>
              <Col s={12}>
                <h1 className="center-align">Search</h1>
                <Search
                  apiKey='AIzaSyAtSE-0lZOKunNlkHt8wDJk9w4GjFL9Fu4'
                  callback={this.searchCallback} />
              </Col>
              <Col s={12}>
                <MuiThemeProvider muiTheme={getMuiTheme()}>
                  <List style={{height: '600px', overflowY:'auto'}}>
                    {content}
                  </List>
                </MuiThemeProvider>
              </Col>
            </Col>
          </Row>
          {this.props.children}
        </main>
        <footer>
        </footer>
      </div>
    );
  }
}

export default App;
