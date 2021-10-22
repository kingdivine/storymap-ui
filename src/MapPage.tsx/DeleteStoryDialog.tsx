import { useState } from "react";
import {
  Dialog,
  Typography,
  Button,
  CircularProgress,
  Theme,
  IconButton,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { useTheme } from "@material-ui/styles";
import axios from "axios";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { StoryDetail } from "../types/StoryDetail";

export default function DeleteStoryDialog(props: {
  story: StoryDetail;
  onCloseDialog: () => void;
}) {
  const theme: Theme = useTheme();
  const { story } = props;

  const [currentUser] = useCurrentUser();

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleSubmit = () => {
    setIsLoading(true);
    setIsError(false);
    axios
      .delete(`/storymap-api/stories/${story.id}`, {
        headers: {
          authorization: `Bearer ${currentUser!.token}`,
        },
      })
      .then((result) => {
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
            Story Deleted
          </Typography>

          <Button variant="contained" color="primary" href={`/`}>
            Home
          </Button>
        </div>
      </Dialog>
    );
  }
  return (
    <Dialog onClose={() => props.onCloseDialog()} open={true}>
      <div style={{ margin: 8, padding: 16 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: 16,
            justifyContent: "space-between",
          }}
        >
          <Typography variant={"h5"} color={"textPrimary"}>
            Delete Story
          </Typography>
          <IconButton onClick={props.onCloseDialog}>
            <CloseIcon />
          </IconButton>
        </div>
        <Typography variant={"h6"}>
          Are you sure you want to delete your Story?
        </Typography>

        <div style={{ display: "flex", justifyContent: "end", marginTop: 16 }}>
          <Button
            variant={"text"}
            size="small"
            color={"primary"}
            disabled={isLoading}
            onClick={() => props.onCloseDialog()}
          >
            Cancel
          </Button>
          <Button
            variant={"text"}
            size="small"
            style={{ color: theme.palette.error.main }}
            disabled={isLoading}
            onClick={() => handleSubmit()}
          >
            {isLoading ? <CircularProgress size={20} /> : "Delete"}
          </Button>
        </div>
        {isError && (
          <Typography variant={"caption"} color="error">
            Oops! Something went wrong.
          </Typography>
        )}
      </div>
    </Dialog>
  );
}
