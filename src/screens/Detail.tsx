import React from "react";
import { RouteComponentProps } from "react-router-native";

import {
  Button,
  SafeAreaView,
  View,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  Picker,
  Switch,
  Alert,
} from "react-native";
import { Formik, FormikValues } from "formik";
import * as Yup from "yup";
import { db } from "../Firebase";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Constants from "expo-constants";
import { Text } from "../GlobalStyles";

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

type DetailState = {
  prevState: DetailState;
  loading: boolean;
  member: FormValues;
};

type FormValues = {
  name: string;
  email: string;
  age: number;
  category: string;
  reason: string;
  status: number;
};
export type RouteProps = RouteComponentProps<{ uid: string }>;

export default class Detail extends React.Component<RouteProps, DetailState> {
  initialValues: FormValues = {
    name: "",
    email: "",
    age: 18,
    category: "",
    reason: "",
    status: 0,
  };
  state: DetailState = {
    loading: true,
    member: this.initialValues,
  };
  constructor(props: RouteProps) {
    super(props);
    this.getMember(this.props.match.params.uid);
  }
  //更新ボタンが押されたら
  handleOnSubmit = (values: FormValues) => {
    this.setState({ loading: true });
    db.collection("members").doc(this.props.match.params.uid).update({
      name: values.name,
      email: values.email,
      age: values.age,
      category: values.category,
      reason: values.reason,
      status: values.status,
    });
    //Topに移動
    this.props.history.push("/List");
  };
  handleDelete = (uid: string) => {
    this.openTwoButtonAlert(() => {
      db.collection("members").doc(uid).delete();
      this.props.history.push("/List");
    });
  };
  render() {
    return (
      <SafeAreaView style={{ backgroundColor: "white", flex: 1 }}>
        <View style={styles.activityView}>
          <ActivityIndicator size="large" animating={this.state.loading} />
        </View>
        <KeyboardAwareScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "space-between",
          }}
          keyboardShouldPersistTaps="handled"
        >
          <Formik
            enableReinitialize //**** need this or values do not update!
            initialValues={this.state.member}
            onSubmit={(values) => this.handleOnSubmit(values)}
            validationSchema={validationSchema}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              errors,
              values,
              isValid,
              setFieldValue,
            }) => (
              <View style={styles.container}>
                <Text>氏名</Text>
                <TextInput
                  style={styles.textInput}
                  value={values.name}
                  maxLength={50}
                  keyboardType="default"
                  onChangeText={handleChange("name")}
                  onBlur={handleBlur("name")}
                />
                {errors.name && <Text style={styles.error}>{errors.name}</Text>}

                <Text>Email</Text>
                <TextInput
                  style={styles.textInput}
                  value={values.email}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  onChangeText={handleChange("email")}
                  onBlur={handleBlur("email")}
                />
                {errors.email && (
                  <Text style={styles.error}>{errors.email}</Text>
                )}

                <Text>年齢</Text>
                <TextInput
                  style={styles.textInput}
                  value={String(values.age)}
                  maxLength={2}
                  keyboardType="number-pad"
                  onChangeText={handleChange("age")}
                  onBlur={handleBlur("age")}
                />
                {errors.age && <Text style={styles.error}>{errors.age}</Text>}

                <Text>希望職種</Text>
                <Picker
                  selectedValue={values.category}
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
                  value={values.reason}
                  keyboardType="default"
                  multiline={true}
                  onChangeText={handleChange("reason")}
                  onBlur={handleBlur("reason")}
                />
                {errors.reason && (
                  <Text style={styles.error}>{errors.reason}</Text>
                )}
                <Text>ステータス</Text>
                <Switch
                  style={styles.switch}
                  trackColor={{ false: "#767577", true: "#81b0ff" }}
                  thumbColor={values.status ? "#f5dd4b" : "#f4f3f4"}
                  onValueChange={(i) => {
                    this.setState((prevState: DetailState) => ({
                      member: {
                        ...prevState.member,
                        status: i ? 1 : 0,
                      },
                    }));
                  }}
                  value={values.status == 1}
                />

                <View
                  style={{
                    flexDirection: "row",
                    width: "100%",
                    justifyContent: "space-around",
                  }}
                >
                  <Button
                    onPress={handleSubmit}
                    disabled={!isValid}
                    title="更新する"
                  />
                  <Button
                    onPress={() =>
                      this.handleDelete(this.props.match.params.uid)
                    }
                    disabled={!isValid}
                    color="red"
                    title="削除する"
                  />
                </View>
              </View>
            )}
          </Formik>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    );
  }
  getMember = async (uid: string) => {
    const docRef = db.collection("members").doc(uid);
    const doc = await docRef.get();
    if (doc.exists) {
      this.setState({
        loading: false,
        member: doc.data() as FormValues,
      });
    } else {
      this.props.history.push("/404");
    }
  };
  openTwoButtonAlert = (yes: Function) => {
    Alert.alert(
      "削除",
      "削除しますか？",
      [
        {
          text: "Yes",
          onPress: () => {
            yes();
          },
        },
        {
          text: "No",
          onPress: () => {},
        },
      ],
      {
        cancelable: true,
      }
    );
  };
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 40,
    marginBottom: 10,
    marginTop: Constants.statusBarHeight + 20,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  activityView: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
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
  switch: {
    marginBottom: 10,
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
});
