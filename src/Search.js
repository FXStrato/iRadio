/*eslint no-unused-vars: "off"*/ //don't show warnings for unused
import React, {Component} from 'react';
import Time from 'react-time';
import JSONP from 'jsonp';
import YoutubeFinder from 'youtube-finder';
import {Link, hashHistory} from 'react-router';
import {Row, Col} from 'react-materialize';
import {RaisedButton, FlatButton, Dialog, TextField, List, ListItem, AutoComplete, CircularProgress} from 'material-ui';
import _ from 'lodash';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import 'whatwg-fetch'; //for polyfill

const googleAutoSuggestURL = '//suggestqueries.google.com/complete/search?client=youtube&ds=yt&q=';

class Search extends Component {
  constructor(props) {
    super(props);
    this.onUpdateInput  = this.onUpdateInput.bind(this);
    this.onNewRequest   = this.onNewRequest.bind(this);
    this.YoutubeClient  = YoutubeFinder.createClient({ key: this.props.apiKey });
    this.state = {
      dataSource : [],
      inputValue : ''
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
    this.props.callback(items, temp);
  }

  render() {
    return (
      <div className="center-align">
        <MuiThemeProvider muiTheme={getMuiTheme()}>
          <AutoComplete
            id="searchbar"
            fullWidth={true}
            searchText={this.state.inputValue}
            floatingLabelText={this.props.placeHolder}
            filter={AutoComplete.noFilter}
            openOnFocus={true}
            dataSource={this.state.dataSource}
            onUpdateInput={this.onUpdateInput}
            onNewRequest={this.onNewRequest} />
        </MuiThemeProvider>
      </div>
    );
  }
}

export default Search;
