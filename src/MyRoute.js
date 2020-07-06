import React from "react";
import { Route } from "react-router-native";

export default class MyRoute extends React.Component {
  render() {
    var { Component, path, exact, passedProps } = this.props;
    return (
      <Route
        path={path}
        exact={exact}
        render={(props) => <Component {...props} {...passedProps} />}
      />
    );
  }
}
