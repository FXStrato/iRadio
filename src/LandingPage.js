import React from 'react';
//import firebase from 'firebase';
import {Row, Col} from 'react-materialize';
import {AppBar, FlatButton, Tabs, Tab} from 'material-ui';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import {Link, hashHistory} from 'react-router';

class LandingPage extends React.Component {

  render() {

    const styles = {
      headline: {
        fontSize: 24,
        paddingTop: 16,
        marginBottom: 12,
        fontWeight: 400,
      },
    }

    return (
      <Row>
        <Col s={12} m={12} l={12} className='center-align'>
          <Navbar />
        </Col>
        <Col s={12} m={12} l={12} className='center-align'>
          <Login />
        </Col>
      </Row>
    );
  }
}

class Navbar extends React.Component {


  handleClick = () => {
    console.log("iRadio");
  };

  render() {

    const styles = {
      title: {
        cursor: 'pointer',
      },
    };

    return (
      <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
        <AppBar
          title={<span style={styles.title}>iRadio</span>}
          onTitleTouchTap={this.handleClick()}
          iconElementRight={<FlatButton label="User" />}
        />
      </MuiThemeProvider>
    );
  };

}

class Login extends React.Component {
  render() {

    const styles = {
      headline: {
        fontSize: 24,
        paddingTop: 16,
        marginBottom: 12,
        fontWeight: 400,
      },
    }

    return (
      <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
        <Tabs>
          <Tab label="SignUp">
            <div>
              <h2 style={styles.headline}>Sign Up</h2>
              <p>Sign Up</p>
            </div>
          </Tab>
          <Tab label="SignIn">
            <div>
              <h2 style={styles.headline}>Sign In</h2>
              <p>Sign In</p>
            </div>
          </Tab>
        </Tabs>
      </MuiThemeProvider>
    );
  }
}

export default LandingPage;
