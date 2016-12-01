import React  from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import './App.css';
import RadioPlayer from './ReactPlayer';

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <MuiThemeProvider>
          <RadioPlayer  />
        </MuiThemeProvider>
      </div>
    );
  }
}

export default App;
