import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './styles.css';
import TwitterLogo from "./twitter-logo.png";

class Home extends Component {

  constructor(props) {
    super(props);
    this.state = {
      user: [],
      tweetText: ""
    }
  }

  getUser = () => {
    fetch('http://localhost:5000/checkstat')
      .then(res => res.json())
      .then(user => this.setState({ user }))
  }

  userStatus(x) {
    if (typeof (x) === "undefined") {
      return "Not logged in"
    } else {
      return `${this.state.user.displayName}`
    }
  }

  userPic(x) {
    if (typeof (x) === "undefined") {
      return "https://abs.twimg.com/sticky/default_profile_images/default_profile_200x200.png"
    } else {
      return this.state.user._json.profile_image_url_https.replace(/_normal/g, "");
    }
  }

  setStatus() {
    if (typeof (this.state.user.id) === "undefined") {
      return "off";
    } else {
      return "on";
    }
  }

  componentDidMount() {
    this.getUser();
    this.setStatus();
  }

  tweetText() {
    this.setState({
      tweetText: encodeURI(document.getElementById("tweet-text").value)
    });
  }

  render() {
    return (
      <div className="App">
        <img className="twitter-logo" src={TwitterLogo} width="150px" height="auto" alt="twitter-logo" />
        <h1>Twitter <span>(Not Twitter)</span></h1>
        <div className="profile-img">
          <img src={this.userPic(this.state.user._json)} alt="profile-pic" />
        </div>
        <h1>{this.userStatus(this.state.user.displayName)}</h1>
        <div className={this.setStatus()}>
          <a className="login-btn" href="http://localhost:5000/login/twitter">Login</a>
          <a className="logout-btn" href="http://localhost:5000/logout">Logout</a>
        </div>
        <div className={`tweet-box-${this.setStatus()}`}>
          <textarea onChange={() => this.tweetText()} id="tweet-text" placeholder="Send a tweet..."></textarea>
          <a href={`http://localhost:5000/sendtweet?text=${this.state.tweetText}`}>send</a>
        </div>
      </div>
    );
  }
}

export default Home;