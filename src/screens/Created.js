import React from "react";
import { Link } from "react-router-native";
import { View, SafeAreaView, StyleSheet, TouchableOpacity } from "react-native";
import { Text } from "../GlobalStyles";

import Constants from "expo-constants";

export default function Created() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View>
          <Text style={styles.text}>申し込みしました。</Text>
        </View>
        <View>
          <Link component={TouchableOpacity} to="/">
            <Text style={styles.text}>戻る</Text>
          </Link>
        </View>
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
  text: {
    fontSize: 30,
    marginBottom: 30,
  },
});
