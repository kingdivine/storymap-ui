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

import MailOutlineIcon from "@material-ui/icons/MailOutline";
import { isMobile, isValidEmail } from "../utils";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formContainer: {
      marginTop: theme.spacing(1.5),
      marginBottom: theme.spacing(1),
      display: "flex",
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "space-between",
    },
  })
);

export default function ChangePasswordForm() {
  const classes = useStyles();

  const [email, setEmail] = useState("");
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleEmailTextFieldChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    setEmail(e.target.value);
  };

  const handleSubmit = () => {
    setIsLoading(true);
    setIsError(false);
    setIsSuccess(false);
    axios
      .post(`storymap-api/users/send-password-reset-link`, {
        email,
      })
      .then((result) => {
        setIsSuccess(true);
      })
      .catch((e) => {
        setIsError(true);
      })
      .finally(() => setIsLoading(false));
  };

  const isValidInput = email.length > 0 && isValidEmail(email);
  const showHelperText = email.length > 0 && !isValidInput;

  return (
    <Paper style={{ padding: isMobile() ? 16 : 32, maxWidth: "85vw" }}>
      <Typography variant="h4" color="secondary">
        Password Reset
      </Typography>

      {!isSuccess && !isError && (
        <>
          <Typography variant="body1" style={{ marginTop: 16 }}>
            Enter your email to receive a password reset link.
          </Typography>
          <div className={classes.formContainer}>
            <TextField
              placeholder="email"
              variant="outlined"
              size="small"
              value={email}
              onChange={(e) => handleEmailTextFieldChange(e)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MailOutlineIcon fontSize={"small"} />
                  </InputAdornment>
                ),
              }}
              error={showHelperText}
              helperText={showHelperText ? "Please enter a valid email." : null}
            />
            <Button
              size="small"
              variant={"contained"}
              color={"primary"}
              disabled={email.length === 0 || !isValidInput || isLoading}
              onClick={() => handleSubmit()}
              style={{ marginTop: showHelperText ? -24 : 0 }}
            >
              {isLoading ? <CircularProgress size={20} /> : "Get Link"}
            </Button>
          </div>
        </>
      )}

      {isError && (
        <>
          <Typography style={{ marginTop: 8 }} color={"error"}>
            Oops! Something went wrong.
          </Typography>
          <Typography style={{ marginTop: 8 }}>
            Please check your internet connection and try again later.
          </Typography>
        </>
      )}
      {isSuccess && (
        <>
          <Typography style={{ marginTop: 8 }} color={"primary"}>
            Email sent.
          </Typography>
          <Typography style={{ marginTop: 8 }}>
            If there is an account associated with the provided email
            <br /> you should receive a link in your inbox shortly.
          </Typography>
        </>
      )}
    </Paper>
  );
}
