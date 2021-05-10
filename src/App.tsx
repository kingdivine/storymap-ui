import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { useLocalStorage } from "./hooks/useLocalStorage";
import LoginPage from "./LoginPage.tsx/LoginPage";
import MapPage from "./MapPage.tsx/MapPage";

function App() {
  const [currentUser] = useLocalStorage("currentUser", null);

  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/login">
            {currentUser ? <Redirect to="/home" /> : <LoginPage />}
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
