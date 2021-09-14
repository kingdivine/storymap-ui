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
import VerificationPage from "./VerificationPage/VerificationPage";
import ForgotPasswordPage from "./ForgotPasswordPage/ForgotPasswordPage";

function App() {
  const [currentUser] = useLocalStorage("currentUser", null);

  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/login">
            {currentUser ? <Redirect to="/" /> : <LoginPage />}
          </Route>
          <Route path="/" exact component={MapPage} />
          <Route exact path="/account">
            {currentUser ? <AccountPage /> : <Redirect to="/login" />}
          </Route>
          <Route exact path="/story/:postSlug" component={MapPage} />
          <Route
            exact
            path="/users/:userId/verify/:verifcationCode"
            component={VerificationPage}
          />
          <Route exact path="/forgot-password" component={ForgotPasswordPage} />
          <Route>NOT FOUND</Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
