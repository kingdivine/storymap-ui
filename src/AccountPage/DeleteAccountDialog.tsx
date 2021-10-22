import { useState } from "react";
import {
  Dialog,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Theme,
  IconButton,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { useTheme } from "@material-ui/styles";
import axios from "axios";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { useHistory } from "react-router";

export default function DeleteAccountDialog(props: {
  onCloseDialog: () => void;
}) {
  let history = useHistory();

  const [currentUser, setCurrentUser] = useCurrentUser();

  const [confirmDeleteText, setConfirmDeleteText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  const theme: Theme = useTheme();

  const handleSubmit = () => {
    setIsLoading(true);
    setIsError(false);
    axios
      .delete(`/storymap-api/users`, {
        headers: {
          authorization: `Bearer ${currentUser!.token}`,
        },
      })
      .then((result) => {
        setCurrentUser(null);
        setIsSuccess(true);
      })
      .catch((e) => {
        setIsError(true);
      })
      .finally(() => setIsLoading(false));
  };
  if (isSuccess) {
    return (
      <Dialog open={true}>
        <div style={{ margin: 16, padding: 16, textAlign: "center" }}>
          <Typography variant={"h5"} style={{ marginBottom: 8 }}>
            Account Deleted
          </Typography>
          <Typography variant={"h6"} style={{ marginBottom: 8 }}>
            We're sad to see you go :(
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => history.push("/")}
          >
            Home
          </Button>
        </div>
      </Dialog>
    );
  }
  return (
    <Dialog onClose={() => props.onCloseDialog()} open={true}>
      <div style={{ margin: 16, padding: 16 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: 16,
            justifyContent: "space-between",
          }}
        >
          <Typography variant={"h5"} color={"textPrimary"}>
            Delete Account
          </Typography>
          <IconButton onClick={props.onCloseDialog}>
            <CloseIcon />
          </IconButton>
        </div>
        <Typography variant={"h6"}>Are you sure want to proceed?</Typography>
        <Typography variant={"h6"} style={{ marginBottom: 16 }}>
          This action is{" "}
          <span style={{ color: theme.palette.secondary.main }}>
            irreversible
          </span>
          .
        </Typography>
        <div style={{ display: "flex", alignItems: "baseline" }}>
          <TextField
            placeholder="Type 'delete' to confirm"
            size="small"
            variant="outlined"
            value={confirmDeleteText}
            onChange={(e) => setConfirmDeleteText(e.target.value)}
            style={{ marginRight: 8 }}
            error={isError}
            helperText={isError ? "Oops! Something went wrong." : null}
          />
          <Button
            variant={"contained"}
            size="small"
            color={"primary"}
            disabled={confirmDeleteText !== "delete" || isLoading}
            onClick={() => handleSubmit()}
          >
            {isLoading ? <CircularProgress size={20} /> : "Proceed"}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
