import { useState } from "react";
import {
  Button,
  Checkbox,
  createStyles,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  makeStyles,
  Theme,
  Typography,
  IconButton,
} from "@material-ui/core";
import FilterListIcon from "@material-ui/icons/FilterList";
import UserSearch from "./UserSearch";
import CloseIcon from "@material-ui/icons/Close";
import TagSearch from "./TagSearch";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    filterContainer: { marginTop: theme.spacing(3) },
    form: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      "&>*": {
        margin: theme.spacing(1),
      },
    },
    closeButton: {
      position: "absolute",
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },
  })
);

export type User = { username: string; id: string };
export type Tag = { title: string; id: string };
export interface FilterObj {
  user: User | null;
  tag: Tag | null;
  followingOnly: boolean | null;
}

export default function Filter(props: {
  onFilterChange: (filter: FilterObj) => void;
}) {
  const classes = useStyles();
  const [formOpen, setFormOpen] = useState(false);

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
        <DialogTitle>
          Filter Posts
          <IconButton
            aria-label="close"
            className={classes.closeButton}
            onClick={() => setFormOpen(false)}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent className={classes.form}>
          <UserSearch
            onUserSelect={(user) => {
              props.onFilterChange({ user, tag: null, followingOnly: null });
              setFormOpen(false);
            }}
          />
          <Typography variant="body2">OR</Typography>
          <TagSearch
            onTagSelect={(tag) => {
              props.onFilterChange({ user: null, tag, followingOnly: null });
              setFormOpen(false);
            }}
          />
          <Typography variant="body2">OR</Typography>
          <FormControlLabel
            disabled
            control={
              <Checkbox
                checked={true}
                onChange={() => {
                  props.onFilterChange({
                    user: null,
                    tag: null,
                    followingOnly: true,
                  });
                  setFormOpen(false);
                }}
              />
            }
            label="Following"
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
