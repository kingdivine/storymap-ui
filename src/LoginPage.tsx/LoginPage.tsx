import { useState } from "react";
import {
  createStyles,
  makeStyles,
  Theme,
  Typography,
  Button,
  Collapse,
} from "@material-ui/core";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import mapBackground from "../Generic/images/map-background.png";
import LoginForm from "./LoginForm";
import NavBar from "../Generic/Navbar";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    pageContainer: {
      backgroundImage: `url(${mapBackground})`,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center center",
      border: "1px solid grey",
      boxSizing: "border-box",
      height: "100vh",
    },
    header: {
      position: "fixed",
      right: theme.spacing(5),
      top: theme.spacing(5),
    },
    loginContainer: {
      marginTop: "20vh",
      display: "flex",
      alignItems: "center",
      flexDirection: "column",
    },
    strapLine: {
      marginTop: -16,
    },
    button: {
      marginTop: theme.spacing(1),
      borderColor: theme.palette.common.white,
    },
  })
);

export default function LoginPage() {
  const classes = useStyles();
  const [showForm, setShowForm] = useState(false);
  return (
    <>
      <NavBar fetchNotifs={false} />
      <div className={classes.pageContainer}>
        <div className={classes.loginContainer}>
          <Typography
            variant="h6"
            color={"textPrimary"}
            className={classes.strapLine}
          >
            Your Online Travel Diary
          </Typography>

          <Collapse in={!showForm}>
            <Button
              variant="outlined"
              className={classes.button}
              startIcon={<MailOutlineIcon />}
              onClick={() => setShowForm(true)}
            >
              Continue with Email
            </Button>
          </Collapse>
          <Collapse in={showForm}>
            <LoginForm />
          </Collapse>
        </div>
      </div>
    </>
  );
}
