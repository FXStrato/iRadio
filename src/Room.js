import React from 'react';
import firebase from 'firebase';


class Room extends React.Component{
    render(){
        return(
          <div>
            <h3>Begin your Music Jounery</h3>
            <p> room</p>
            <Search
            apiKey='AIzaSyAtSE-0lZOKunNlkHt8wDJk9w4GjFL9Fu4'
            callback={this.searchCallback} />
          </div>
        )
    }
}

export default Room;
