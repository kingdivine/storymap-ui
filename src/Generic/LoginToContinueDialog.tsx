import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import { Button, IconButton, Typography } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { useHistory } from "react-router-dom";
import { ReactElement } from "react";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    topLineContainer: {
      display: "flex",
      justifyContent: "flex-end",
    },
    content: {
      display: "flex",
      flexDirection: "column",
      "&>*": {
        marginTop: theme.spacing(1),
        marginLeft: "auto",
        marginRight: "auto",
      },
    },
  })
);

export default function LoginToContinueDialog(props: {
  icon: ReactElement;
  message: string;
  onCloseDialog: () => void;
}) {
  const classes = useStyles();
  let history = useHistory();

  return (
    <Dialog
      fullWidth={true}
      maxWidth={"xs"}
      open={true}
      onClose={props.onCloseDialog}
      style={{ border: "1px solid" }}
    >
      <div>
        <div className={classes.topLineContainer}>
          <IconButton onClick={props.onCloseDialog}>
            <CloseIcon />
          </IconButton>
        </div>
      </div>

      <DialogContent className={classes.content}>
        <div style={{ width: 80, height: 80 }}>{props.icon}</div>
        <Typography
          variant={"h4"}
          color={"textPrimary"}
          style={{ textAlign: "center" }}
        >
          Login to continue
        </Typography>
        <Typography
          variant={"h5"}
          color={"secondary"}
          style={{ textAlign: "center" }}
        >
          {props.message}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => history.push("/login")}
          style={{ marginBottom: 24 }}
        >
          Login or Signup
        </Button>
      </DialogContent>
    </Dialog>
  );
}
