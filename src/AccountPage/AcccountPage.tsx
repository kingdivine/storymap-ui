import { useLocalStorage } from "../hooks/useLocalStorage";
import {
  createStyles,
  makeStyles,
  Theme,
  Typography,
  Button,
  Avatar,
} from "@material-ui/core";
import Heading from "../Generic/Heading";
import Footer from "../Generic/Footer";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    mainContent: {
      marginTop: "15vh",
      marginLeft: "auto",
      marginRight: "auto",
      width: "50%",
      textAlign: "center",
    },
    userNameAndPicContainer: {
      display: "flex",
      alignItems: "center",
      border: "1px solid red",
      justifyContent: "center",
    },
    logoutButton: {
      borderColor: theme.palette.common.white,
    },
  })
);

export default function AccountPage() {
  const classes = useStyles();
  let history = useHistory();
  const [currentUser, setCurrentUser] = useLocalStorage("currentUser", null);

  const handleLogout = async () => {
    await setCurrentUser(null);
    history.push("/login");
  };

  return (
    <>
      {currentUser && (
        <>
          <Heading />
          <div className={classes.mainContent}>
            <div className={classes.userNameAndPicContainer}>
              <Avatar src="/broken-image.jpg" style={{ marginLeft: -2 }} />
              <Typography style={{ margin: 8 }}>
                {currentUser.username}
              </Typography>
            </div>
            <Typography>{currentUser.email}</Typography>
            <Button
              variant="outlined"
              className={classes.logoutButton}
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
          <Footer />
        </>
      )}
    </>
  );
}
