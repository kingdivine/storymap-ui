import { createStyles, makeStyles, Paper, Theme } from "@material-ui/core";
import Heading from "./Heading";
import mapBackground from "../Generic/images/map-background.png";

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
      marginTop: "15vh",
      display: "flex",
      alignItems: "center",
      flexDirection: "column",
    },
    paper: {
      padding: theme.spacing(2),
      maxWidth: "85%",
      textAlign: "center",
      "&>*": {
        margin: theme.spacing(2),
      },
    },
  })
);

export default function StaticPage(props: { children: React.ReactNode }) {
  const classes = useStyles();
  const { children } = props;

  return (
    <div className={classes.pageContainer}>
      <Heading />
      <div className={classes.paperContainer}>
        <Paper className={classes.paper}>{children}</Paper>
      </div>
    </div>
  );
}
