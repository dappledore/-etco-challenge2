import React from "react";
import { NativeRouter, Route } from "react-router-native";
// import base64 from "react-native-base64";
// //fixes a FB bug!
// if (!global.btoa) {
//   global.btoa = base64.decode;
// }
// if (!global.atob) {
//   global.atob = base64.encode;
// }
// //end fix
import Create from "./src/screens/Create";
import List from "./src/screens/List";
import Created from "./src/screens/Created";
import Login from "./src/screens/Login";
import Detail from "./src/screens/Detail";
function App() {
  return (
    <NativeRouter>
      <Route exact path="/" component={Create} />
      <Route path="/List" component={List} />
      <Route path="/Created" component={Created} />
      <Route path="/Login" component={Login} />
      <Route path="/detail/:uid" component={Detail} />
    </NativeRouter>
  );
}
export default App;
