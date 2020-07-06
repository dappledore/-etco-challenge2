import React, { useState } from "react";
import {
  Button,
  View,
  SafeAreaView,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Picker,
  Platform,
} from "react-native";
import { Formik, ErrorMessage } from "formik";
import * as Yup from "yup";

import { Text } from "../GlobalStyles";
import Constants from "expo-constants";
import firebase, { db } from "../Firebase";
import { sendGridEmail } from "../SendEmail";

const validationSchema = Yup.object().shape({
  name: Yup.string().max(50, "氏名は長すぎます。").required("氏名は必須です。"),
  email: Yup.string()
    .email("Emailが正しくありません。")
    .max(255, "Emailは長すぎます。")
    .required("Emailは必須です。"),
  age: Yup.number()
    .required("年齢は必須です。")
    .positive()
    .min(18, "年齢が18から")
    .truncate(),
  category: Yup.string().required("希望職種は必須です。"),
  reason: Yup.string()
    .max(255, "希望理由は長すぎます。")
    .required("希望理由は必須です。"),
});
import { Link } from "react-router-native";

export default (props) => {
  const [selectedCategory, setSelectedCategory] = useState("");
  return (
    <SafeAreaView style={{ backgroundColor: "white", flex: 1 }}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "space-between",
        }}
        keyboardShouldPersistTaps="handled"
      >
        <Formik
          initialValues={{ name: "", email: "", category: "" }}
          onSubmit={(values) => {
            save(values);
            const sendRequest = sendGridEmail(
              values.email,
              "dappledore@gmail.com",
              "求人エントリサイト へようこそ",
              values.name + "様、\n 申し込みしました。"
            );
            sendRequest
              .then((response) => {
                console.log("Mail Success");
              })
              .catch((error) => {
                console.log("mail error:" + error);
              });
            props.history.push("/Created");
          }}
          validationSchema={validationSchema}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            errors,
            values,
            setFieldValue,
          }) => (
            <View style={styles.container}>
              <Text>氏名</Text>
              <TextInput
                style={styles.textInput}
                name="name"
                maxLength={50}
                keyboardType="default"
                onChangeText={handleChange("name")}
                onBlur={handleBlur("name")}
              />
              {errors.name && <Text style={styles.error}>{errors.name}</Text>}

              <Text>Email</Text>
              <TextInput
                style={styles.textInput}
                name="email"
                keyboardType="email-address"
                autoCapitalize="none"
                onChangeText={handleChange("email")}
                onBlur={handleBlur("email")}
              />
              {errors.email && <Text style={styles.error}>{errors.email}</Text>}

              <Text>年齢</Text>
              <TextInput
                style={styles.textInput}
                name="age"
                maxLength={2}
                keyboardType="number-pad"
                onChangeText={handleChange("age")}
                onBlur={handleBlur("age")}
              />
              {errors.age && <Text style={styles.error}>{errors.age}</Text>}

              <Text>希望職種</Text>
              <Picker
                selectedValue={values.category}
                name="category"
                style={styles.picker}
                onValueChange={(itemValue) => {
                  setFieldValue("category", itemValue);
                }}
                itemStyle={styles.pickerItem}
              >
                <Picker.Item label="選択してください" value="" />
                <Picker.Item
                  label="グラフィックデザイナー"
                  value="グラフィックデザイナー"
                />
                <Picker.Item
                  label="エンタメデザイナー"
                  value="エンタメデザイナー"
                />
                <Picker.Item
                  label="グラフィックデザイナー(インハウス)"
                  value="グラフィックデザイナー(インハウス)"
                />
              </Picker>

              {errors.category && (
                <Text style={styles.error}>{errors.category}</Text>
              )}

              <Text>希望理由</Text>
              <TextInput
                style={[styles.textInput, styles.textField]}
                name="reason"
                keyboardType="default"
                multiline={true}
                onChangeText={handleChange("reason")}
                onBlur={handleBlur("reason")}
              />
              {errors.reason && (
                <Text style={styles.error}>{errors.reason}</Text>
              )}

              <Button
                onPress={handleSubmit}
                title="申込み"
                color="black"
                height="30"
              />
            </View>
          )}
        </Formik>
        <View style={styles.loginView}>
          <Link component={TouchableOpacity} to="/Login">
            <Text style={[styles.text, { fontSize: 20 }]}>管理ログイン</Text>
          </Link>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

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
    height: 30,
    width: "100%",
    borderColor: "gray",
    color: "black",
    borderWidth: 1,
    padding: 5,
    marginBottom: 10,
    fontSize: 15,
  },
  textField: {
    height: 100,
  },
  picker: {
    width: "100%",
    borderColor: "black",
    borderWidth: 1,
    marginBottom: 20,
  },
  pickerItem: {
    height: 110,
  },
  error: { fontSize: 15, color: "red" },
  loginView: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingEnd: 50,
  },
});

async function save(values) {
  const col = db.collection("members");
  try {
    const last = await col.orderBy("sort", "desc").limit(1).get();
    const sort = last.docs[0].data().sort;
    const docId = col.doc().id;
    col.doc(docId).set({
      name: values.name,
      email: values.email,
      age: values.age,
      category: values.category,
      reason: values.reason,
      status: 0,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      sort: sort + 1, //getting the size costs x number or reads depending on col size
    });
    col.get().then((snap) => {});
  } catch (err) {
    console.log(err);
  }
}
