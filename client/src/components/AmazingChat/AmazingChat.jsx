import React, { Component } from "react";
import "./AmazingChat.scss";
import { connect, sendMsg } from "../../socket";
import { TbMessage, TbMessageDots } from "react-icons/tb";

class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "",
      msgs: [],
      theme: "card--accent",
    };
  }

  componentDidMount = () => {
    connect((msg) => {
      console.log("New Message", msg, msg.origin);
      this.setState({
        msgs: [...this.state.msgs, msg.data],
      });
    });
  };

  // on change of input, set the value to the message state
  onChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  onSubmit = (e) => {
    e.preventDefault();
    sendMsg(this.state.message);

    this.setState({ message: "" });
  };

  render() {
    const messages = this.state.msgs.map((m, i) => {
      const { from, timestamp, message } = JSON.parse(m);
      return (
        <div class={`container`}>
          <p style={{ textAlign: "right" }}>
            <h4 key={i}>{message}</h4>
          </p>
          <p>
            {" "}
            <span class="time-left">{from}</span>
          </p>

          <span class="time-right">{timestamp}</span>
        </div>
      );
    });

    return (
      <div>
        <article className="l-design-widht">
          <h1>
            <TbMessageDots></TbMessageDots> Kayee...
          </h1>

          <p>Chalo bakar kare!</p>

          <p>
            This is a simple chat application written in Golang and Reactjs. It
            is using websocket for communication.
          </p>
          <blockquote>
            Build for fun by
            <a href="https://schadokar.dev" target="_blank" rel="noreferrer">
              {" "}
              <cite> ~Shubham Chadokar</cite>
            </a>
          </blockquote>
          <q>
            Application is using HTML and CSS source code from{" "}
            <a
              href="https://codepen.io/meodai/pen/rNedxBa"
              target="_blank"
              rel="noreferrer"
            >
              Codepen
            </a>{" "}
            by{" "}
            <a href="https://elastiq.ch/" target="_blank" rel="noreferrer">
              David A.
            </a>
          </q>

          <h3>Select theme</h3>
          <button
            style={{ backgroundColor: "#ffffff", border: "solid" }}
            onClick={() => {
              this.setState({ theme: "" });
            }}
          ></button>
          <button
            style={{ backgroundColor: "#fab700", border: "solid" }}
            onClick={() => {
              this.setState({ theme: "card--accent" });
            }}
          ></button>
          <button
            style={{
              backgroundColor: "#212121",
              border: "solid",
              color: "#ffffff",
            }}
            onClick={() => {
              this.setState({ theme: "card--inverted" });
            }}
          ></button>

          <div className={`card ${this.state.theme}`}>
            <h2>
              {" "}
              <TbMessage></TbMessage> Aur Batao!
            </h2>
            <div className="message-history">
              <ul>{messages}</ul>
            </div>
            <form onSubmit={this.onSubmit}>
              <label className="input">
                <input
                  className="input__field input-msg"
                  type="name"
                  placeholder=" "
                  name="message"
                  value={this.state.message}
                  onChange={this.onChange}
                />
                <span className="input__label">Ka chala hai...</span>
              </label>
              <div className="button-group">
                <button type="submit" onClick={this.onSubmit}>
                  Send
                </button>
              </div>
            </form>
          </div>
        </article>
      </div>
    );
  }
}

export default Chat;
