import React, {Component} from 'react';
import MessageList from './MessageList.jsx';
import Chatbar from './Chatbar.jsx';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notification : "",
      currentUser: {name: "Nima"}, // optional. if currentUser is not defined, it means the user is Anonymous
      messages: [],
      numberOfConnection: "",
      userColor:"",
    };

    this.newMessageAdded = this.newMessageAdded.bind(this);
    this.userChangedName = this.userChangedName.bind(this);
  }


  componentDidMount() {
    this.socket = new WebSocket("ws://localhost:3001/", "protocolOne");
    this.socket.onmessage = (event) => {
      const incomingData =  JSON.parse(event.data);
      switch(incomingData.type) {
        case "incomingMessage":
          const newMessage = {
            type: incomingData.type,
            username: incomingData.username,
            content: incomingData.content,
            id: incomingData.id,
            color: incomingData.color,
            photo: incomingData.image
          };

          const messages = this.state.messages.concat(newMessage)
          this.setState({messages: messages})
          break;
        case "incomingNotification":
          const anotherMessage = {
            type: incomingData.type,
            content: incomingData.content,
            id: incomingData.id
          };
          const notification = this.state.messages.concat(anotherMessage)
          this.setState({messages: notification})
          break;
        case "connections":
          this.setState({numberOfConnection: incomingData.number})
          break;
        case "colors":
          this.setState({userColor:incomingData.colorcode})
          break;
     }
    }
  }

  userChangedName(newName) {
    this.setState({currentUser:{name:newName}})
    if(this.state.currentUser["name"] !== newName) {
      const nameChangeObject = {
        type: "postNotification",
        content: newName,
        content: `${this.state.currentUser["name"]} has changed to ${newName}`
      };
      this.socket.send(JSON.stringify(nameChangeObject));
    }
  }

  newMessageAdded(newcontent) {
    console.log("the contect is",newcontent);
    const messageObject = {
      type: "postMessage",
      username: this.state.currentUser["name"],
      content: newcontent,
      color: this.state.userColor
    };
    this.socket.send(JSON.stringify(messageObject));
    console.log("Data sent to server");
  }

  render() {
    return (
      <div>
        <nav className="navbar">
          <a href="/" className="navbar-brand">Chatty</a>
          <a href="/" className="navbar-user" >{this.state.numberOfConnection} </a>
        </nav>
        <MessageList messages={this.state.messages}  />
        <Chatbar currentUser={this.state.currentUser} handleMessage= {this.newMessageAdded} handleUsername = {this.userChangedName} />
      </div>
    );
  }
}

export default App;
