import { createStyles, makeStyles, Theme, Typography } from "@material-ui/core";
import MapIcon from "@material-ui/icons/Map";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: "flex",
      alignItems: "center",
    },
    mapIcon: {
      fontSize: 50,
      color: theme.palette.text.gold,
    },
    storyText: {
      color: theme.palette.text.primary,
      fontSize: 58,
    },
    mapText: {
      color: theme.palette.text.gold,
      fontSize: 58,
    },
  })
);

export default function Heading() {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <MapIcon fontSize={"large"} className={classes.mapIcon} />
      <Typography className={classes.storyText}>story</Typography>
      <Typography className={classes.mapText}>map</Typography>
    </div>
  );
}
