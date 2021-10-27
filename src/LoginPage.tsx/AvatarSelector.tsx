import { useState } from "react";
import {
  Avatar,
  Button,
  createStyles,
  makeStyles,
  Paper,
  Popover,
  Theme,
} from "@material-ui/core";
import { AVATAR_NAMES } from "../Generic/UsernameandPic";
import { useTheme } from "@material-ui/styles";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      padding: 8,
      border: `1px solid ${theme.palette.common.white}`,
    },
    row: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
    },
    avatar: {
      height: 64,
      width: 64,
      margin: theme.spacing(1),
      boxSizing: "border-box",
      "&:hover": {
        cursor: "pointer",
        border: `5px solid ${theme.palette.common.white}`,
      },
    },
  })
);

export default function AvatarSelector(props: {
  onSelect: (selected: string) => void;
  selected: string;
}) {
  const classes = useStyles();
  const theme: Theme = useTheme();

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelectAvatar = (name: string) => {
    props.onSelect(name);
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const selectedStyling = (name: string) => {
    if (props.selected === name) {
      return {
        border: `5px solid ${theme.palette.primary.main}`,
      };
    } else if (props.selected && props.selected !== name) {
      return { opacity: "50%" };
    }
    return {};
  };

  return (
    <>
      <Button
        aria-describedby={id}
        variant="outlined"
        color="primary"
        onClick={handleButtonClick}
        startIcon={
          <Avatar
            src={
              props.selected
                ? require(`../Generic/images/avatars/${props.selected}.svg`)
                    .default
                : "none"
            }
            style={{ height: 24, width: 24 }}
          />
        }
      >
        Select Avatar
      </Button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      >
        <Paper className={classes.paper}>
          <div className={classes.row}>
            {AVATAR_NAMES.slice(0, 12).map((name) => (
              <Avatar
                src={require(`../Generic/images/avatars/${name}.svg`).default}
                className={classes.avatar}
                style={selectedStyling(name)}
                onClick={() => handleSelectAvatar(name)}
              />
            ))}
          </div>
          <div className={classes.row}>
            {AVATAR_NAMES.slice(12, 24).map((name) => (
              <Avatar
                src={require(`../Generic/images/avatars/${name}.svg`).default}
                className={classes.avatar}
                style={selectedStyling(name)}
                onClick={() => handleSelectAvatar(name)}
              />
            ))}
          </div>
          <div className={classes.row}>
            {AVATAR_NAMES.slice(24, 36).map((name) => (
              <Avatar
                src={require(`../Generic/images/avatars/${name}.svg`).default}
                className={classes.avatar}
                style={selectedStyling(name)}
                onClick={() => handleSelectAvatar(name)}
              />
            ))}
          </div>
          <div className={classes.row}>
            {AVATAR_NAMES.slice(36, 48).map((name) => (
              <Avatar
                src={require(`../Generic/images/avatars/${name}.svg`).default}
                className={classes.avatar}
                style={selectedStyling(name)}
                onClick={() => handleSelectAvatar(name)}
              />
            ))}
          </div>
        </Paper>
      </Popover>
    </>
  );
}
