import React, {Component} from 'react';
import Message from './Message.jsx';


class MessageList extends Component {



  render() {
    console.log("Rendering <MessageList/>");
    return (
      <div>

          {this.props.messages.map((msg,index) => {

                return (


                <Message

                  key={msg.id}
                  userNames = {msg.username}
                  messagesHere = {msg.content}
                  messagesType = {msg.type}
                  userColor = {msg.color}


                />

              );

          })}

      </div>
    );
  }
}
export default MessageList;



