
import React, {Component} from 'react';
import MessageList from './MessageList.jsx';
import Chatbar from './Chatbar.jsx';


class App extends Component {

//

  constructor(props) {
      super(props);
      this.state = {
        notification : "",
        currentUser: {name: "Nima"}, // optional. if currentUser is not defined, it means the user is Anonymous
        messages: [],
        numberOfConnection: "",
        userColor:"",


      };
    this.newMessageAdded= this.newMessageAdded.bind(this);
    this.userChangedName= this.userChangedName.bind(this);
    // this.getRandomColor=this.getRandomColor.bind(this);
  }


  componentDidMount() {

    this.socket = new WebSocket("ws://localhost:3001/", "protocolOne");
    this.socket.onmessage = (event) => {

      const incomingData =  JSON.parse(event.data)

      switch(incomingData.type) {

        case "incomingMessage":

          const newMessage = {type :incomingData.type, username: incomingData.username, content: incomingData.content, id: incomingData.id, color:incomingData.color };
          const messages = this.state.messages.concat(newMessage)
          this.setState({messages: messages})
          console.log("incoming data is :",messages);

          break;

          case "incomingNotification":

           //console.log("numberofconnections before:",incomingData);

           const anotherMessage = {type :incomingData.type, content: incomingData.content, id: incomingData.id};
           const notification = this.state.messages.concat(anotherMessage)
           this.setState({messages: notification})
           //console.log("numberofconnections after:",this.state.numberOfConnection);

           break;



        case "connections":

           //console.log("numberofconnections before:",incomingData);

           //const anotherMessage = {type :incomingData.type, content: incomingData.content, id: incomingData.id};
           //const notification = this.state.messages.concat(anotherMessage)
           this.setState({numberOfConnection: incomingData.number})
           //console.log("numberofconnections after:",this.state.numberOfConnection);

           break;

        case "colors":

        //console.log("color:",incomingData.colorcode);
        this.setState({userColor:incomingData.colorcode})

        break;





      }




    }

  };

userChangedName(newName) {

  this.setState({currentUser:{name:newName}})

   if(this.state.currentUser["name"] !== newName) {

        const nameChangeObject = {type: "postNotification", content: newName, content: `${this.state.currentUser["name"]} has changed to ${newName}`};
        console.log("heyyyyyyyyyyyyy@@@@@@",nameChangeObject)
        this.socket.send(JSON.stringify(nameChangeObject));
        console.log("heyyyyyyyyyyyyy@@@@@@")
        //this.setState({currentUser:{name:newName} })
      }

}

// getRandomColor() {
//     var letters = '0123456789ABCDEF';
//     var color = '#';
//     for (var i = 0; i < 6; i++ ) {
//         color += letters[Math.floor(Math.random() * 16)];
//     }
//     return color;
// }




  newMessageAdded(newcontent) {

    console.log("the contect is",newcontent);
       const messageObject = {type: "postMessage", username: this.state.currentUser["name"], content: newcontent, color: this.state.userColor};
       this.socket.send(JSON.stringify(messageObject));
       console.log("Data sent to server");

        // if(this.state.currentUser["name"] !== newName) {

        // const nameChangeObject = {type: "postNotification", content: newName, content: `${this.state.currentUser["name"]} has changed to ${newName}`};
        // this.socket.send(JSON.stringify(nameChangeObject));
        // const name =
        // this.setState({currentUser:{name:newName} })
      // }

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
