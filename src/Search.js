/*eslint no-unused-vars: "off"*/ //don't show warnings for unused
import React, {Component} from 'react';
import Time from 'react-time';
import JSONP from 'jsonp';
import YoutubeFinder from 'youtube-finder';
import {Link, hashHistory} from 'react-router';
import {Row, Col} from 'react-materialize';
import {RaisedButton, FlatButton, Dialog, TextField, List, ListItem, AutoComplete, CircularProgress} from 'material-ui';
import _ from 'lodash';
import ytDurationFormat from 'youtube-duration-format';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import 'whatwg-fetch'; //for polyfill

const googleAutoSuggestURL = '//suggestqueries.google.com/complete/search?client=youtube&ds=yt&q=';
const ytURL = 'https://www.youtube.com/watch?v=';

class Search extends Component {
  constructor(props) {
    super(props);
    this.onUpdateInput  = this.onUpdateInput.bind(this);
    this.onNewRequest   = this.onNewRequest.bind(this);
    this.YoutubeClient  = YoutubeFinder.createClient({ key: this.props.apiKey });
    this.state = {
      dataSource : [],
      inputValue : '',
      results: [],
      durations: [],
      finished: false
    }
  }

  performSearch() {
    const
      self = this,
      url  = googleAutoSuggestURL + this.state.inputValue;

    if(this.state.inputValue !== '') {
      JSONP(url, function(error, data) {
        let searchResults, retrievedSearchTerms;

        if(error) return console.log(error);

        searchResults = data[1];

        retrievedSearchTerms = searchResults.map(function(result) {
          return result[0];
        });

        self.setState({
          dataSource : retrievedSearchTerms
        });
      });
    }
  }

  onUpdateInput(inputValue) {
    const self = this;

    this.setState({
      inputValue : inputValue
      },function(){
      self.performSearch();
    });
  }

  onNewRequest(searchTerm) {
    this.setState({finished: false});
    document.querySelector('#list-progress').style.display = 'inline-block';
    const
      self   = this,
      params = {
        part        : 'id,snippet',
        type        : 'video',
        q           : this.state.inputValue,
        maxResults  : this.props.maxResults <= 50 ? this.props.maxResults : '50'
      }

    this.YoutubeClient.search(params, function(error,results) {
      if(error) return console.log(error);
      self.setState({results: results.items});
      self.getDurations(results.items);
      self.setState({
        dataSource : []
      });
    });
  }

  getDurations = items => {
    //This currently only gives me promises
    let temp = _.map(items, elem => {
      return fetch('https://www.googleapis.com/youtube/v3/videos?id=' + elem.id.videoId + '&part=contentDetails&key=' + this.props.apiKey)
      .then(res => {
        return res.json();
      }).catch(err => console.log(err))
    })
    for(let i = 0; i < temp.length; i++) {
      temp[i].then(data => {
        let duration = this.state.durations;
        duration.push(ytDurationFormat(data.items[0].contentDetails.duration));
        this.setState({durations: duration});
        if(i === temp.length - 1) {
          this.setState({finished: true})
          document.querySelector('#list-progress').style.display = 'none';
        }
      });
    }
  }

  handleCallback = result => {
  console.log(result);
  }

  render() {
    let content = [];
    if(this.state.finished) {
      let callback = this.props.callback;
      content = _.map(this.state.results, (elem, index) => {
        let temp = {url: ytURL + elem.id.videoId, duration: this.state.durations[index], thumbnail: elem.snippet.thumbnails.default.url};
        return <ListItem
          onTouchTap={() => this.handleCallback(temp)}
          style={{overflow: 'hidden'}}
          innerDivStyle={{padding: '0', margin: '10px 10px 0px 0px',}}
          key={elem.id.videoId}
          leftAvatar={<img className="responsive-img" style={{position: 'none', float: 'left', marginRight: '10px'}} src={elem.snippet.thumbnails.default.url} alt={elem.id.videoId}/>}
          primaryText={<div style={{paddingTop: '20px'}}>{elem.snippet.title}</div>}
          secondaryText={this.state.durations[index] ? elem.snippet.channelTitle + ' | ' + this.state.durations[index] : elem.snippet.channelTitle + ' | Loading...'}
          secondaryTextLines={2}
        />
      });
    }


    return (
      <Row>
        <Col s={12} m={12} l={6} className="center-align">
          <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
            <AutoComplete
              id="searchbar"
              fullWidth={true}
              style={{color: '#039BE5'}}
              searchText={this.state.inputValue}
              floatingLabelText={this.props.placeHolder}
              filter={AutoComplete.noFilter}
              openOnFocus={true}
              dataSource={this.state.dataSource}
              onUpdateInput={this.onUpdateInput}
              onNewRequest={this.onNewRequest} />
          </MuiThemeProvider>
          <MuiThemeProvider className="center-align" muiTheme={getMuiTheme(darkBaseTheme)}>
            <CircularProgress style={{display: 'none'}} id="list-progress" size={45}/>
          </MuiThemeProvider>
        </Col>
        <Col s={12}>
          <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
            <List style={{height: '600px', overflowY:'auto'}}>
              {content}
            </List>
          </MuiThemeProvider>
        </Col>
      </Row>

    );
  }
}

export default Search;
