import React, { Component } from "react";
import { Text as RNText, StyleSheet, TextProps } from "react-native";
const styles = {
  text: {
    fontSize: 20,
    marginBottom: 10,
  },
};
export class Text extends Component<TextProps> {
  render() {
    return (
      <RNText style={[styles.text, this.props.style]}>
        {this.props.children}
      </RNText>
    );
  }
}
