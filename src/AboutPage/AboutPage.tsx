import {
  Button,
  createStyles,
  makeStyles,
  Paper,
  Theme,
  Typography,
} from "@material-ui/core";
import Heading from "../Generic/Heading";
import mapBackground from "../Generic/images/map-background.png";
import { isMobile } from "../utils";

const PARAGRAPHS = [
  "Storymap is an online travel diary. A place to share your stories and experiences from your community and around the world. It’s a place to journal your adventures and encounters, your insights and your life.",
  "Document stories for your own private viewing - as a memento for your future self - or post in public mode, for all to see and share. Simply curious? Well, fly around the map to various locations, and check out what’s happening over here and over there.",
  "There’s 8 billion stories to be written. Why not write yours?",
];

const DIVIDER_EMOJIS = [0x1f58b, 0x1f30e, 0x1f918];

const smallScreen = isMobile();

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
      maxWidth: smallScreen ? "85%" : "60%",
      textAlign: "center",
      "&>*": {
        margin: theme.spacing(2),
      },
      maxHeight: "75vh",
      overflowY: "scroll",
    },
  })
);

export default function AboutPage() {
  const classes = useStyles();

  return (
    <div className={classes.pageContainer}>
      <Heading />
      <div className={classes.paperContainer}>
        <Paper className={classes.paper}>
          <Typography variant={"h5"} color="secondary">
            What is Storymap?
          </Typography>
          {PARAGRAPHS.map((p, i) => (
            <>
              <Typography variant={"body1"}>{p}</Typography>
              <div>{String.fromCodePoint(DIVIDER_EMOJIS[i])}</div>
            </>
          ))}
          <Button
            variant="contained"
            href="/"
            color="primary"
            style={{ marginBottom: 24 }}
          >
            Tell your Story
          </Button>
        </Paper>
      </div>
    </div>
  );
}
