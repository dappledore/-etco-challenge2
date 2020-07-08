import React from "react";
import {
  TextInput,
  Button,
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import Constants from "expo-constants";
import Item from "../components/Item";
import { db } from "../Firebase";
import { RouteComponentProps } from "react-router-native";

type ListState = {
  list: firebase.firestore.QueryDocumentSnapshot<
    firebase.firestore.DocumentData
  >[];
  currentPage: number;
  itemsPerPage: number;
  lastPage: number;
  total: number;
  loading: boolean;
  searchText: string;
  firstSort: number;
  lastSort: number;
};
export default class List extends React.Component<
  RouteComponentProps,
  ListState
> {
  componentDidMount = async () => {
    this.state.lastSort = 0;
    await this.getData(1);
  };
  state: ListState = {
    list: [],
    currentPage: 1,
    itemsPerPage: 5,
    lastPage: 1,
    total: 0,
    loading: false,
    searchText: "",
    firstSort: 0,
    lastSort: 0,
  };
  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.activityView} pointerEvents="box-none">
          <ActivityIndicator
            size="large"
            color="blue"
            animating={this.state.loading}
          />
        </View>
        <View style={styles.container}>
          <View style={styles.search}>
            <TouchableWithoutFeedback
              onPress={Keyboard.dismiss}
              accessible={false}
            >
              <TextInput
                style={styles.textInput}
                autoCapitalize="none"
                onChangeText={(txt) => {
                  this.searchTextChanged(txt);
                }}
              />
            </TouchableWithoutFeedback>

            <Button
              title="検索"
              onPress={() => this.search()}
              disabled={this.state.loading}
            ></Button>
          </View>
          <FlatList
            style={{
              flexGrow: 0,
              height: "80%",
            }}
            data={this.state.list}
            renderItem={({ item }) => <Item doc={item} item={item.data()} />}
            keyExtractor={(item) => item.id}
          />
          <View style={styles.paging}>
            <Button
              title="＜戻る"
              onPress={() => this.prev()}
              disabled={this.state.currentPage == 1 || this.state.loading}
            ></Button>
            <Button
              title="次へ＞"
              onPress={() => this.next()}
              disabled={
                this.state.currentPage >= this.state.lastPage ||
                this.state.loading
              }
            ></Button>
          </View>
        </View>
      </SafeAreaView>
    );
  }
  //データ取得
  getData = async (dir: number) => {
    const { currentPage, itemsPerPage } = this.state;
    const startAt = currentPage * itemsPerPage - itemsPerPage;
    this.setState({ loading: true });
    const last = await db.collection("members").where("status", "==", 0).get();
    const cnt = last.size; //this is expensive (counts all records) and should be repalced with lookup in production
    const colRef = db.collection("members");
    //firebase has no offset function , so have to do alot of extra work to page
    try {
      let snapshots =
        dir == undefined || dir == 1
          ? await colRef
              .where("status", "==", 0)
              .orderBy("sort", "asc")
              .startAt(this.state.lastSort)
              .limit(itemsPerPage)
              .get()
          : await colRef
              .where("status", "==", 0)
              .orderBy("sort", "desc")
              .startAt(this.state.firstSort)
              .limit(itemsPerPage)
              .get();
      const docs = dir == 0 ? snapshots.docs.reverse() : snapshots.docs;
      const lastSort = docs[docs.length - 1].data().sort + 1;
      const firstSort = docs[0].data().sort - 1;
      // let data = []
      // snapshots.docs.map(doc => data.push( {id:doc.id,name:doc.data().name,email: doc.data().email}))
      //snapshots.docs.map((doc) => console.log(doc));
      this.setState({
        list: docs,
        total: cnt,
        lastPage: Math.ceil(cnt / itemsPerPage),
        loading: false,
        firstSort: firstSort,
        lastSort: lastSort,
      });
    } catch (err) {
      console.log("data error: " + err);
    }
  };
  search = async () => {
    //NOTE: Firebase has no intext searching only exact match, also no OR where so combine arrays
    console.log("search " + this.state.searchText);
    if (this.state.searchText == "") {
      this.setState({ firstSort: 0, lastSort: 0 });
      this.getData(1);
      return;
    }
    this.state.loading = true;
    const colRef = db.collection("members");
    const names = await colRef
      .orderBy("name")
      .startAt(this.state.searchText)
      .endAt(this.state.searchText + "\uf8ff")
      .get();
    const emails = await colRef
      .orderBy("email")
      .startAt(this.state.searchText)
      .endAt(this.state.searchText + "\uf8ff")
      .get();
    this.setState({
      list: names.docs
        .concat(emails.docs)
        .filter((v, i, a) => a.findIndex((t) => t.id === v.id) === i),
      total: 1,
      lastPage: 1,
      currentPage: 1,
      loading: false,
    });
  };
  next() {
    console.log("next");
    this.state.currentPage++;
    this.getData(1);
  }
  prev() {
    console.log("prev");
    this.state.currentPage--;
    this.getData(0);
  }
  searchTextChanged = (txt: string) => {
    console.log(txt);
    this.setState({ searchText: txt });
  };
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 5,
    marginBottom: 10,
    marginTop: Constants.statusBarHeight + 20,
    flexDirection: "column",
    justifyContent: "flex-start",
  },
  paging: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 10,
  },
  search: {
    flexDirection: "row",
    marginLeft: 15,
    justifyContent: "flex-start",
    height: 40,
    marginBottom: 10,
  },
  textInput: {
    height: 40,
    width: 200,
    borderColor: "gray",
    color: "black",
    borderWidth: 1,
    padding: 10,
    fontSize: 20,
    marginBottom: 20,
    marginRight: 10,
  },
  item: {
    backgroundColor: "#f9c2ff",
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
  activityView: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },
  error: { fontSize: 20, color: "red", marginBottom: 10 },
});
