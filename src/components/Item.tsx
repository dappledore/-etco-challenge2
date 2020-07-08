import React, { Component } from "react";
import { Text, View, StyleSheet, Button, TouchableOpacity } from "react-native";
import { Link } from "react-router-native";
type ItemProps = {
  doc: firebase.firestore.QueryDocumentSnapshot<
    firebase.firestore.DocumentData
  >;
  item: firebase.firestore.DocumentData;
};
export default class Item extends Component<ItemProps, {}> {
  render() {
    const { name, email } = this.props.item;
    const { id } = this.props.doc;
    return (
      <View style={styles.item}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.email}>{email}</Text>
        <Link to={`/Detail/${id}`} component={TouchableOpacity}>
          <Text>詳細</Text>
        </Link>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  item: {
    backgroundColor: "#eeeeee",
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-evenly",
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  name: {
    fontSize: 15,
    width: "30%",
  },
  email: {
    fontSize: 15,
    width: "60%",
  },
  error: { fontSize: 20, color: "red", marginBottom: 10 },
});
