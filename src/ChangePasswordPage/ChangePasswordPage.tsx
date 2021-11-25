import { createStyles, makeStyles, Theme } from "@material-ui/core";
import Heading from "../Generic/Heading";
import mapBackground from "../Generic/images/map-background.png";
import ChangePasswordForm from "./ChangePasswordForm";

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
    paperContainer: {
      marginTop: "20vh",
      display: "flex",
      alignItems: "center",
      flexDirection: "column",
    },
  })
);

export default function ChangePasswordPage() {
  const classes = useStyles();
  return (
    <div className={classes.pageContainer}>
      <Heading />
      <div className={classes.paperContainer}>
        <ChangePasswordForm />
      </div>
    </div>
  );
}
