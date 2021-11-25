import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { useCurrentUser } from "./hooks/useCurrentUser";
import LoginPage from "./LoginPage.tsx/LoginPage";
import MapPage from "./MapPage.tsx/MapPage";
import ProfilePage from "./ProfilePage/ProfilePage";
import VerificationPage from "./VerificationPage/VerificationPage";
import ChangePasswordPage from "./ChangePasswordPage/ChangePasswordPage";
import NotificationsPage from "./NotificationsPage/NotificationsPage";
import AboutPage from "./AboutPage/AboutPage";
import NotFoundPage from "./NotFoundPage.tsx/NotFoundPage";

function App() {
  const [currentUser] = useCurrentUser();

  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/login">
            {currentUser ? <Redirect to="/" /> : <LoginPage />}
          </Route>
          <Route path="/" exact component={MapPage} />
          <Route exact path="/about" component={AboutPage} />
          <Route exact path="/users/:username">
            <ProfilePage />
          </Route>
          <Route exact path="/story/:postSlug" component={MapPage} />
          <Route
            exact
            path="/users/:userId/verify/:verifcationCode"
            component={VerificationPage}
          />
          <Route exact path="/users/:id/password-reset/:resetToken">
            <div> verify-password-reset-token</div>
          </Route>
          <Route exact path="/change-password" component={ChangePasswordPage} />
          <Route exact path="/notifications">
            {currentUser ? <NotificationsPage /> : <Redirect to="/login" />}
          </Route>

          <Route component={NotFoundPage} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
