
import React, {Component} from 'react';


class Message extends Component {
  render() {
    console.log("Rendering <Message/>");




      switch(this.props.messagesType) {

        case "incomingMessage":

          //switch(this.props.messagesImage) {

          return (
            <div>
              <div className="message">
                <span className="message-username" style={{color:this.props.userColor}} >{this.props.userNames}  </span>
                <span className="message-content">{this.props.messagesHere} </span>
                <img src={this.props.messagesImage} width="60%"/>
              </div>
            </div>
          )
        break;


        case "incomingNotification":
          return (
            <div>
              <div className ="message system">

              {this.props.messagesHere}

              </div>
            </div>
          )
         break;

        }





  }
}

export default Message;




