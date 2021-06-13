import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { useLocalStorage } from "./hooks/useLocalStorage";
import LoginPage from "./LoginPage.tsx/LoginPage";
import MapPage from "./MapPage.tsx/MapPage";
import AccountPage from "./AccountPage/AcccountPage";

function App() {
  const [currentUser] = useLocalStorage("currentUser", null);

  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/login">
            {currentUser ? <Redirect to="/home" /> : <LoginPage />}
          </Route>
          <Route path="/home">
            <MapPage />
          </Route>
          <Route exact path="/account">
            {currentUser ? <AccountPage /> : <Redirect to="/login" />}
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
