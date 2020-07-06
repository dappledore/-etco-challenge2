import React from "react";
import { Text as RNText, TextInput as RNTextInput } from "react-native";

const styles = {
  text: {
    fontSize: 15,
    marginBottom: 5,
  },
};

export var Text = (props) => (
  <RNText style={[styles.text, props.style]}>{props.children}</RNText>
);
