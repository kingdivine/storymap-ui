import { useLocalStorage } from "../hooks/useLocalStorage";
import {
  createStyles,
  makeStyles,
  Theme,
  Typography,
  Avatar,
  Divider,
} from "@material-ui/core";
import Heading from "../Generic/Heading";
import Footer from "../Generic/Footer";

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
      justifyContent: "center",
    },
    section: {
      display: "flex",
      flexDirection: "column",
      textAlign: "start",
      marginTop: theme.spacing(3),
    },
  })
);

export default function NotificationsPage() {
  const classes = useStyles();
  const [currentUser] = useLocalStorage("currentUser", null);

  return (
    <>
      {currentUser && (
        <>
          <Heading />
          <div className={classes.mainContent}>
            <div className={classes.userNameAndPicContainer}>
              <Avatar src="/broken-image.jpg" style={{ marginLeft: -2 }} />
              <Typography style={{ margin: 8 }} color="textPrimary">
                {currentUser.username}
              </Typography>
            </div>
            <Divider style={{ margin: 8 }} />

            <div className={classes.section}>Notifications</div>
          </div>
          <Footer />
        </>
      )}
    </>
  );
}
