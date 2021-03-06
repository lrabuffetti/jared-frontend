import React, { Component } from "react";
import { Form } from "semantic-ui-react";
import { observer } from "mobx-react";
import signInStore from "../../stores/SignInStore";
import AppStore from "../../stores/AppStore";
import logo from "../../images/logo1.png";
import axios from "axios";
import { Redirect } from "react-router-dom";
import profileStore from "../../stores/ProfileStore";

let loginErrorMessage = false;

const LoginTopNavBar = observer(
  class LoginTopNavBar extends Component {
    constructor(props) {
      super(props);
      this.handleChange = this.handleChange.bind(this);
      signInStore.navigate = false;
    }

    handleChange(e) {
      signInStore[e.target.name] = e.target.value;
      loginErrorMessage = false;
    }

    async logIn() {
      loginErrorMessage = false;

      await axios
        .post(AppStore.URL + "/api/login", {
          email: signInStore.email,
          password: signInStore.password
        })
        .then(function(response) {
          profileStore.getUserData(signInStore.email);
          signInStore.navigate = true;
          signInStore.email = "";
          signInStore.password = "";
        })
        .catch(function(error) {
          console.log(error);
          loginErrorMessage = true;
        });
    }

    render() {
      if (signInStore.navigate) {
        return <Redirect to="/home" push={true} />;
      }

      return (
        <div>
          <div className="ui menu">
            <div className="header small item">
              <img src={logo} alt="" />
              Jared
            </div>

            <div className="right menu">
              <div className="item">
                <Form onSubmit={this.handleSubmit}>
                  <Form.Group>
                    <Form.Input
                      className={loginErrorMessage ? "error" : ""}
                      type="text"
                      placeholder="Email or username"
                      name="email"
                      onChange={this.handleChange}
                    />
                    <Form.Input
                      className={loginErrorMessage ? "error" : ""}
                      type="password"
                      placeholder="password"
                      name="password"
                      onChange={this.handleChange}
                    />
                    <Form.Button content="Login" onClick={this.logIn} />
                  </Form.Group>
                </Form>
              </div>
            </div>
          </div>
          {loginErrorMessage ? (
            <div className="ui error message">
              <div className="header">Login failed!</div>
              <p>Invalid email/username or password</p>
            </div>
          ) : null}
        </div>
      );
    }
  }
);

export default LoginTopNavBar;
