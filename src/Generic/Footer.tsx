import { createStyles, makeStyles, Theme, Typography } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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

export default function Footer() {
  const classes = useStyles();
  return (
    <footer className={classes.footer}>
      <Typography variant="subtitle1" className={classes.footerItem}>
        Privacy Policy
      </Typography>
      <Typography variant="subtitle1" className={classes.footerItem}>
        Contact
      </Typography>
      <Typography variant="subtitle1" className={classes.footerItem}>
        <span style={{ textDecoration: "underline" }}>divinebuiltthis</span>{" "}
        &#169; 2021
      </Typography>
    </footer>
  );
}
