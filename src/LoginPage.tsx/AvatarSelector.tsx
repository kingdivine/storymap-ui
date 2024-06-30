import { useState, useEffect } from "react";
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
import { isMobile } from "../utils";

const smallScreen = isMobile();

const ROW_LENGTH = smallScreen ? 4 : 12;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      padding: 8,
      border: `1px solid ${theme.palette.common.white}`,
      maxHeight: "70vh",
      overflowY: "scroll",
    },
    row: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
    },
    avatar: {
      height: smallScreen ? 48 : 64,
      width: smallScreen ? 48 : 64,
      margin: theme.spacing(1),
      boxSizing: "border-box",
      "&:hover": {
        cursor: "pointer",
        border: `5px solid ${theme.palette.common.white}`,
      },
    },
  })
);

const getRows = () => {
  const rows = [];
  for (let i = 0; i < AVATAR_NAMES.length; i += ROW_LENGTH) {
    const row = AVATAR_NAMES.slice(i, i + ROW_LENGTH);
    rows.push(row);
  }
  return rows;
};

const importAllAvatars = async () => {
  const importedAvatars: { [key: string]: any } = {};
  for (const name of AVATAR_NAMES) {
    importedAvatars[name] = (
      await import(`../Generic/images/avatars/${name}.svg`)
    ).default;
  }
  return importedAvatars;
};

export default function AvatarSelector(props: {
  onSelect: (selected: string) => void;
  selected: string;
}) {
  const classes = useStyles();
  const theme: Theme = useTheme();

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [avatars, setAvatars] = useState<{ [key: string]: any }>({});

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

  useEffect(() => {
    const loadAvatars = async () => {
      const importedAvatars = await importAllAvatars();
      setAvatars(importedAvatars);
    };

    loadAvatars();
  }, []);

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
            src={props.selected ? avatars[props.selected] : "none"}
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
          {getRows().map((row, idx) => (
            <div className={classes.row} key={idx}>
              {row.map((avatarName) => (
                <Avatar
                  key={avatarName}
                  src={avatars[avatarName]}
                  className={classes.avatar}
                  style={selectedStyling(avatarName)}
                  onClick={() => handleSelectAvatar(avatarName)}
                />
              ))}
            </div>
          ))}
        </Paper>
      </Popover>
    </>
  );
}
