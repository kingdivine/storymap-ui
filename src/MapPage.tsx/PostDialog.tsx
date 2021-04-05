import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";

import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { IconButton } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    closeButton: {
      position: "absolute",
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },
  })
);

export default function PostDialog(props: {
  post: any;
  closePost: () => void;
}) {
  const classes = useStyles();
  return (
    <>
      <Dialog
        fullWidth={true}
        maxWidth={"md"}
        open={true}
        onClose={props.closePost}
      >
        <DialogTitle>
          {props.post.title}
          <IconButton
            aria-label="close"
            className={classes.closeButton}
            onClick={props.closePost}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>{props.post.content}</DialogContentText>
        </DialogContent>
      </Dialog>
    </>
  );
}
