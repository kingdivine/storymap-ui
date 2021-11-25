import { createStyles, makeStyles, Theme } from "@material-ui/core";
import Heading from "../Generic/Heading";
import mapBackground from "../Generic/images/map-background.png";
import GetPasswordResetLinkForm from "./GetPasswordResetLinkForm";

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

export default function GetPasswordResetLinkPage() {
  const classes = useStyles();
  return (
    <div className={classes.pageContainer}>
      <Heading />
      <div className={classes.paperContainer}>
        <GetPasswordResetLinkForm />
      </div>
    </div>
  );
}
