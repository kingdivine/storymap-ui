import React, { useState } from "react";
import {
  Button,
  Checkbox,
  Chip,
  createStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  makeStyles,
  OutlinedInput,
  TextField,
  Theme,
  Typography,
} from "@material-ui/core";
import FilterListIcon from "@material-ui/icons/FilterList";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    filterContainer: { marginTop: theme.spacing(3) },
    userSection: {
      display: "flex",
      alignItems: "center",
      marginBottom: theme.spacing(1),
    },
  })
);

export default function Filter() {
  const classes = useStyles();

  const [formOpen, setFormOpen] = useState(false);

  //form state
  const [username, setUsername] = useState("");
  const [followingOnly, setFollowingOnly] = useState(false);
  const [tags, setTags] = useState<string[]>([]);

  const handleUsernameChange = (event: any) => {
    const regex = /^[a-z0-9]+$/i;

    if (regex.test(event.target.value) || event.target.value === "") {
      setUsername(event.target.value);
      setFollowingOnly(false);
    }
  };

  const handleCheckChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setUsername("");
    }
    setFollowingOnly(event.target.checked);
  };

  const handleTagInputKeyUp = (event: any) => {
    if (event.key === "Enter" || event.key === " ") {
      const newTag = event.target.value;

      if (
        newTag.trim().length > 0 &&
        !tags.includes(newTag) &&
        tags.length < 3
      ) {
        setTags([...tags, event.target.value]);
      }

      event.target.value = null;
    }
  };

  const handleTagDelete = (tagToDelete: string) => {
    setTags((tags) => tags.filter((tag) => tag !== tagToDelete));
  };

  const handleSubmit = () => {
    setFormOpen(false);
    console.log(username, tags, followingOnly);
  };

  return (
    <div className={classes.filterContainer}>
      <Button
        variant="contained"
        color="primary"
        startIcon={<FilterListIcon />}
        onClick={() => setFormOpen(true)}
      >
        Filter
      </Button>
      <Dialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle>Filter Posts</DialogTitle>
        <DialogContent>
          <div className={classes.userSection}>
            <TextField
              value={username}
              variant="outlined"
              placeholder="username"
              onChange={handleUsernameChange}
            />
            <Typography variant="body2" style={{ marginLeft: 8 }}>
              OR
            </Typography>
            <FormControlLabel
              style={{ marginLeft: 8 }}
              control={
                <Checkbox
                  checked={followingOnly}
                  onChange={handleCheckChange}
                />
              }
              label="Following"
            />
          </div>
          <OutlinedInput
            onKeyUp={handleTagInputKeyUp}
            inputProps={{ maxLength: 30 }}
            style={{ maxWidth: "100%" }}
            startAdornment={tags.map((tag, index) => (
              <Chip
                key={index}
                style={{ margin: 2 }}
                variant="outlined"
                label={tag.startsWith("#") ? tag : `#${tag}`}
                size="small"
                onDelete={() => handleTagDelete(tag)}
              />
            ))}
            placeholder={tags.length > 0 ? "" : "tags (max 3)"}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFormOpen(false)} style={{ color: "red" }}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Go
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
