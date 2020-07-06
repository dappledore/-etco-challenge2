import React from "react";
// import { View, Text, SafeAreaView } from "react-native";
import { NativeRouter, Route, Switch } from "react-router-native";

import Create from "./src/screens/Create";
import Created from "./src/screens/Created";
import Login from "./src/screens/Login";
import List from "./src/screens/List";
// import Detail from "./src/screens/Detail";
// import page404 from "./src/screens/page404";

function App() {
  return (
    <NativeRouter>
      <Route exact path="/" component={Create} />
      <Route path="/Created" component={Created} />
      <Route path="/Login" component={Login} />
      <Switch>
        <Route path="/List/" component={List} />
        {/* <Route path="/detail/:uid" component={Detail} />
          <Route render={() => <p>not found.</p>} /> */}
      </Switch>
      {/* <Route path="/404" component={page404} />
      <Route component={page404} /> */}
    </NativeRouter>
  );
}

export default App;
