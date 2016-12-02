/*eslint no-unused-vars: "off"*/ //don't show warnings for unused
import React, { Component } from 'react';
import {Row, Col} from 'react-materialize';
import {RaisedButton, FlatButton, Dialog, TextField, List, ListItem, AppBar} from 'material-ui';
import _ from 'lodash';
import Search from './Search';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.searchCallback = this.searchCallback.bind(this);
  }

  //Callback to handle search results
  searchCallback = (id, duration, thumbnail) => {
    console.log(id);
  }

  render() {

    return (
      <div>
        <header>

        </header>
        <main className="container">
          <h1 className="center-align">Search</h1>
          <Search
            apiKey='AIzaSyAtSE-0lZOKunNlkHt8wDJk9w4GjFL9Fu4'
            callback={this.searchCallback} />
        </main>
        <footer>

        </footer>
      </div>
    );
  }
}

export default App;
