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
import Heading from "../Generic/Heading";
import mapBackground from "../Generic/images/map-background.png";
import LoginForm from "./LoginForm";
import Footer from "../Generic/Footer";

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
      marginTop: "25vh",
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
    footer: {
      display: "flex",
      alignItems: "right",
      position: "fixed",
      right: theme.spacing(2),
      bottom: theme.spacing(1),
    },
    footerItem: {
      margin: theme.spacing(1),
      color: theme.palette.grey[400],
    },
  })
);

export default function LoginPage() {
  const classes = useStyles();
  const [showForm, setShowForm] = useState(false);
  return (
    <div className={classes.pageContainer}>
      <header className={classes.header}>
        <Typography variant="body1" color={"textPrimary"}>
          What is Storymap?
        </Typography>
      </header>
      <div className={classes.loginContainer}>
        <Heading />
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
      <Footer />
    </div>
  );
}
