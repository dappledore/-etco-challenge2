import * as yup from "yup";
import { Formik } from "formik";

import React, { Component, Fragment } from "react";
import {
  TextInput,
  Text,
  Button,
  SafeAreaView,
  View,
  StyleSheet,
} from "react-native";
import Constants from "expo-constants";
import firebase from "../Firebase";

export default class Login extends Component {
  state = {
    loading: false, //spinner制御用
  };

  _isMounted = false;

  componentDidMount = () => {
    this._isMounted = true;
  };

  componentWillUnmount = () => {
    this._isMounted = false;
  };
  render() {
    return (
      <Formik
        initialValues={{ email: "", password: "" }}
        onSubmit={(values, actions) => {
          if (this._isMounted) this.setState({ loading: true });
          console.log("submit");

          firebase
            .auth()
            .signInWithEmailAndPassword(values.email, values.password)
            .then((res) => {
              this.props.history.push("/List");
              if (this._isMounted) this.setState({ loading: false });
            })
            .catch((error) => {
              console.log("login error: " + error);

              if (this._isMounted) this.setState({ loading: false });
              actions.setStatus({ loginFailed: true });
              actions.setSubmitting(false);
            });
        }}
        validationSchema={yup.object().shape({
          email: yup
            .string()
            .email("Emailが正しくありません")
            .required("Emailは必須です。"),
          password: yup.string().required("Passwordは必須です。"),
        })}
      >
        {({
          handleChange,
          errors,
          status,
          setFieldTouched,
          touched,
          isValid,
          handleSubmit,
        }) => (
          <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.container}>
              <TextInput
                style={styles.textInput}
                keyboardType="email-address"
                onChangeText={handleChange("email")}
                onBlur={() => setFieldTouched("email")}
                autoCapitalize="none"
                placeholder="E-mail"
              />
              {touched.email && errors.email && (
                <Text style={styles.error}>{errors.email}</Text>
              )}
              <TextInput
                style={styles.textInput}
                onChangeText={handleChange("password")}
                placeholder="Password"
                onBlur={() => setFieldTouched("password")}
                secureTextEntry={true}
              />
              {touched.password && errors.password && (
                <Text style={styles.error}>{errors.password}</Text>
              )}
              {status && status.loginFailed && (
                <Text style={styles.error}>
                  パスワードまたはメールアドレスが正しくありません
                </Text>
              )}
              <Button
                title="ログイン"
                disabled={!isValid}
                onPress={handleSubmit}
              />
            </View>
          </SafeAreaView>
        )}
      </Formik>
    );
  }
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
    fontSize: 20,
    marginBottom: 20,
  },
  error: { fontSize: 20, color: "red", marginBottom: 10 },
});
