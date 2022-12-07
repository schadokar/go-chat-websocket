import React, { Component } from "react";
import "../App.css";
import { connect, sendMsg } from "../socket";

class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "",
      msgs: [],
    };
  }

  componentDidMount = () => {
    connect((msg) => {
      this.setState({
        msgs: [...this.state.msgs, msg.data],
      });
    });
  };

  // on change of input, set the value to the message state
  onChange = (event) => {
    this.setState({ message: event.target.value });
  };

  onSubmit = (e) => {
    e.preventDefault();
    sendMsg(this.state.message);
    this.setState({ message: "" });
  };

  render() {
    const messages = this.state.msgs.map((m, i) => {
      return <p key={i}>{m}</p>;
    });

    return (
      <div className="App">
        <div className="App-header">💬 Kayee...</div>
        <div className="message-history">
          <div>{messages}</div>
        </div>

        <form onSubmit={this.onSubmit}>
          <div>
            <input
              className="input-1"
              type="name"
              placeholder="ka chala hai..."
              name="message"
              value={this.state.message}
              onChange={this.onChange}
            />

            <button className="button-2" type="submit" onClick={this.onSubmit}>
              Send
            </button>
          </div>
        </form>
        <footer style={{ textAlign: "center", paddingTop: "10px" }}>
          <blockquote>
            Build for fun by
            <a href="https://schadokar.dev" target="_blank" rel="noreferrer">
              {" "}
              <cite> ~Shubham Chadokar</cite>
            </a>
          </blockquote>
        </footer>
      </div>
    );
  }
}

export default Chat;
