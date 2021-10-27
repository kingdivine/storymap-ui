import { createStyles, makeStyles, Theme, Typography } from "@material-ui/core";
import Heading from "../Generic/Heading";
import mapBackground from "../Generic/images/map-background.png";
import ForgotPasswordForm from "./ForgotPasswordForm";

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
    paperContainer: {
      marginTop: "25vh",
      display: "flex",
      alignItems: "center",
      flexDirection: "column",
    },
  })
);

export default function LoginPage() {
  const classes = useStyles();
  return (
    <div className={classes.pageContainer}>
      <header className={classes.header}>
        <Typography variant="body1" color={"textPrimary"}>
          What is Storymap?
        </Typography>
      </header>
      <div className={classes.paperContainer}>
        <Heading />
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
