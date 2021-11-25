import {
  Button,
  createStyles,
  Divider,
  makeStyles,
  Paper,
  Theme,
  Typography,
} from "@material-ui/core";
import { useHistory } from "react-router";
import Heading from "../Generic/Heading";
import mapBackground from "../Generic/images/map-background.png";
import NotFoundGif from "./not-found.gif";

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

export default function NotFoundPage() {
  const classes = useStyles();
  const history = useHistory();

  return (
    <div className={classes.pageContainer}>
      <Heading />
      <div className={classes.paperContainer}>
        <Paper className={classes.paper}>
          <Typography variant={"h5"} color="error">
            404
          </Typography>
          <Divider />
          <Typography variant={"body1"}>A little lost?</Typography>
          <div>
            <img
              alt="Man with map looking lost"
              src={NotFoundGif}
              height={150}
            />
          </div>
          <Typography variant={"body1"}>
            The URL <em>{history.location.pathname}</em> doesn't exist
          </Typography>
          <Button
            variant="contained"
            href="/"
            color="primary"
            style={{ marginBottom: 24 }}
          >
            Take me home
          </Button>
        </Paper>
      </div>
    </div>
  );
}
