/*eslint no-unused-vars: "off"*/ //don't show warnings for unused
import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Queue from './SongList';
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
<<<<<<< HEAD
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
=======
          <h1 className="center-align">Search</h1>
          <Search
            apiKey='AIzaSyAtSE-0lZOKunNlkHt8wDJk9w4GjFL9Fu4'
            callback={this.searchCallback} />
>>>>>>> b1c96e26f035808037214561ffa1fa55195e51d5
        </main>
        <footer>
        </footer>
      </div>
    );
  }
}

export default App;
