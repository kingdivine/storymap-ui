import { useState } from "react";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import {
  IconButton,
  TextField,
  Typography,
  Dialog,
  DialogContent,
  DialogTitle,
  CircularProgress,
  Switch,
  FormControlLabel,
  DialogActions,
  Button,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import LocationSearch from "./LocationSearch";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    topLineContainer: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    },
    form: {
      display: "flex",
      justifyContent: "center",
      flexDirection: "column",
    },
  })
);

export default function CreatePostForm(props: { closeForm: () => void }) {
  const classes = useStyles();

  const [isLoading] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);

  return (
    <>
      <Dialog
        fullWidth={true}
        maxWidth={"md"}
        open={true}
        onClose={props.closeForm}
      >
        <DialogTitle>
          <div className={classes.topLineContainer}>
            <Typography variant="h6">Create Post</Typography>
            <IconButton onClick={props.closeForm}>
              <CloseIcon />
            </IconButton>
          </div>
        </DialogTitle>

        <DialogContent>
          <div className={classes.form}>
            <TextField placeholder="Title" style={{ marginBottom: 16 }} />
            <LocationSearch
              placeHolderText={"Enter location..."}
              textFieldWidth={400}
              onLocationSelect={() => {}}
            />
            <TextField
              style={{ marginTop: 8 }}
              multiline
              placeholder={"Tell your story..."}
              variant="outlined"
              rows={8}
              rowsMax={8}
            />
            <FormControlLabel
              style={{ marginTop: 8 }}
              control={
                <Switch
                  checked={isPrivate}
                  onChange={() => setIsPrivate(!isPrivate)}
                  color="primary"
                />
              }
              label="Private (only you can see this)"
            />
          </div>
        </DialogContent>

        <DialogActions>
          <Button
            size="small"
            variant={"contained"}
            color={"primary"}
            style={{ margin: 8 }}
            //disabled={!canPost() || isLoading}
            //onClick={() => handlePostSubmit()}
          >
            {isLoading ? <CircularProgress size={20} /> : "Post"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
