import React, { useState } from "react";
import axios from "axios";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import {
  Button,
  CircularProgress,
  InputAdornment,
  TextField,
  Typography,
} from "@material-ui/core";
import { useCurrentUser } from "../hooks/useCurrentUser";
//icons
import VpnKeyIcon from "@material-ui/icons/VpnKey";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    formContainer: {
      display: "flex",
      alignItems: "center",
      flexDirection: "column",
      "&>*": {
        margin: theme.spacing(1),
      },
      padding: theme.spacing(1),
      paddingTop: theme.spacing(2),
    },
    btnContainer: {
      display: "flex",
      justifyContent: "flex-end",
      margin: theme.spacing(2),
    },
    successMsg: {
      display: "flex",
      alignItems: "center",
      flexDirection: "column",
      padding: theme.spacing(3),
      "&>*": {
        margin: theme.spacing(1),
      },
    },
  })
);

export default function PasswordResetForm(props: {
  userId: string;
  resetToken: string;
}) {
  const classes = useStyles();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [, setCurrentUser] = useCurrentUser();

  const isMatchingPassword = () => {
    if (password.length > 0) {
      return password === confirmPassword;
    }
    return true;
  };

  const handleSubmit = () => {
    setIsLoading(true);
    setError("");
    axios
      .post(`/storymap-api/users/${props.userId}/password-reset`, {
        password,
        resetToken: props.resetToken,
      })
      .then((result) => {
        setIsSuccess(true);
        const userObj = { ...result.data.user, token: result.data.token };
        setCurrentUser(userObj);
      })
      .catch((e) => {
        if (
          e.request?.responseText?.includes(
            "Password must be at least 6 and at most 100 characters long."
          )
        ) {
          setError("Password must be 6-100 characters.");
        } else {
          setError("Oops! Something went wrong.");
        }
        setIsLoading(false);
      });
  };

  return (
    <Paper className={classes.root}>
      {isSuccess && (
        <div className={classes.successMsg}>
          <Typography variant="h5">Password successfully changed.</Typography>
          <Button variant="contained" size="small" color="primary" href={`/`}>
            Home
          </Button>
        </div>
      )}
      {!isSuccess && (
        <>
          <div className={classes.formContainer}>
            <TextField
              placeholder="password"
              variant="outlined"
              type={"password"}
              size="small"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <VpnKeyIcon fontSize={"small"} />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              placeholder="confirm password"
              variant="outlined"
              type={"password"}
              size="small"
              error={!isMatchingPassword()}
              helperText={!isMatchingPassword() ? "Passwords must match" : null}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <VpnKeyIcon fontSize={"small"} />
                  </InputAdornment>
                ),
              }}
            />
          </div>
          <Typography style={{ margin: 16 }} color={"error"}>
            {error}
          </Typography>
          <div className={classes.btnContainer}>
            <Button
              size="small"
              variant={"contained"}
              color={"primary"}
              disabled={!isMatchingPassword() || isLoading}
              onClick={() => handleSubmit()}
            >
              {isLoading ? <CircularProgress size={20} /> : "Reset"}
            </Button>
          </div>
        </>
      )}
    </Paper>
  );
}
