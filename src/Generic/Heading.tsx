import {
  createStyles,
  Link,
  makeStyles,
  Theme,
  Typography,
} from "@material-ui/core";
import MapIcon from "@material-ui/icons/Map";
import { isMobile } from "../utils";

const FONT_SIZE = 58;
const FONT_SIZE_MOBILE = 38;
const ICON_SIZE = 50;
const ICON_SIZE_MOBILE = 32;

const smallScreen = isMobile();

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: "flex",
      alignItems: "center",
      zIndex: 1,
      position: "absolute",
      top: theme.spacing(1),
      left: smallScreen
        ? window.innerWidth / 2 - FONT_SIZE_MOBILE * 2 - ICON_SIZE_MOBILE
        : theme.spacing(2),
    },
    mapIcon: {
      fontSize: smallScreen ? ICON_SIZE_MOBILE : ICON_SIZE,
      color: theme.palette.text.gold,
    },
    storyText: {
      color: theme.palette.text.primary,
      fontSize: smallScreen ? FONT_SIZE_MOBILE : FONT_SIZE,
    },
    mapText: {
      color: theme.palette.text.gold,
      fontSize: smallScreen ? FONT_SIZE_MOBILE : FONT_SIZE,
    },
  })
);

export default function Heading() {
  const classes = useStyles();
  return (
    <Link className={classes.container} href={"/"} underline={"none"}>
      <MapIcon className={classes.mapIcon} />
      <Typography className={classes.storyText}>story</Typography>
      <Typography className={classes.mapText}>map</Typography>
    </Link>
  );
}
