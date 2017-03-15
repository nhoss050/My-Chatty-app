import React, {Component} from 'react';

class Chatbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chatbarUsername : this.props.currentUser.name,
      chatbarMessage : "",
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleChange2 = this.handleChange2.bind(this);
  }

  handleChange(event) {
    this.setState({ chatbarUsername: event.target.value });
    if(event.key === "Enter" ){
      this.props.handleUsername(event.target.value);
    }
  }
  
  handleChange2(event) {
    this.setState({ chatbarMessage: event.target.value });
    if(event.key === "Enter" ){
      this.props.handleMessage(event.target.value);
      console.log("event is",event.target.value);
    }
  }

  render() {
    console.log("Rendering <Chatbar/>");
    return (
      <footer className="chatbar">
        <input className="chatbar-username" placeholder="type a name" defaultValue={this.state.chatbarUsername} onKeyPress={this.handleChange} />
        <input className="chatbar-message" placeholder="Type a message and hit ENTER" defaultValue={this.state.chatbarMessage} onKeyPress={this.handleChange2} />
      </footer>
    );
  }
}

export default Chatbar;
