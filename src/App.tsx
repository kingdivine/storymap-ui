import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import LoginPage from "./LoginPage.tsx/Login";
import MapPage from "./MapPage.tsx/MapPage";

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/login">
            <LoginPage />
          </Route>
          <Route path="/">
            <MapPage />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
