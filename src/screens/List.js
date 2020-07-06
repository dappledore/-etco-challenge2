import React from "react";
import {
  TextInput,
  Text,
  Button,
  Alert,
  SafeAreaView,
  View,
  StyleSheet,
} from "react-native";
import Constants from "expo-constants";

export default function List() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "red" }}>
      <View style={styles.container}>
        <Text>List</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 40,
    marginBottom: 10,
    marginTop: Constants.statusBarHeight,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  textInput: {
    height: 50,
    width: 300,
    borderColor: "gray",
    color: "black",
    borderWidth: 1,
    padding: 10,
    fontSize: 30,
    marginBottom: 20,
  },
  error: { fontSize: 20, color: "red", marginBottom: 10 },
});
