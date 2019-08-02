import React from "react";
import { Switch, Route } from "react-router-dom";
import { UploadPage } from "pages";

const App = () => {
  return (
    <Switch>
      <Route path="/" component={UploadPage} exact />
    </Switch>
  );
};
export default App;
