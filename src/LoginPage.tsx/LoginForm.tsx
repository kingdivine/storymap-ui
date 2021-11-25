import React, { useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import {
  Box,
  Button,
  CircularProgress,
  InputAdornment,
  Link,
  TextField,
  Typography,
} from "@material-ui/core";
//icons
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import PersonOutlineIcon from "@material-ui/icons/PersonOutline";
import VpnKeyIcon from "@material-ui/icons/VpnKey";
import { useCurrentUser } from "../hooks/useCurrentUser";
import AvatarSelector from "./AvatarSelector";

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
    },
    btnAndPassowrdLinkContainer: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    btnContainer: {
      display: "flex",
      justifyContent: "flex-end",
      margin: theme.spacing(2),
    },
    verificationEmailMsgContainer: {
      display: "flex",
      alignItems: "center",
      flexDirection: "column",
    },
  })
);

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div hidden={value !== index} {...other}>
      {value === index && (
        <Box p={3}>
          <>{children}</>
        </Box>
      )}
    </div>
  );
}

export default function LoginForm() {
  const classes = useStyles();
  let history = useHistory();
  const [tabValue, setTabValue] = useState(0);

  const [loginValues, setLoginValues] = useState({
    email: "",
    password: "",
  });
  const [signupValues, setSignupValues] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    avatar: "",
  });

  const [loginError, setLoginError] = useState("");
  const [signupError, setSignupError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [, setCurrentUser] = useCurrentUser();
  const [signupSuccess, setSignupSuccess] = useState(false);

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setTabValue(newValue);
  };

  const handleLoginTextFieldChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
    field: "email" | "password"
  ) => {
    setLoginValues({
      ...loginValues,
      [field]: e.target.value,
    });
  };

  const handleSignupTextFieldChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
    field: "username" | "email" | "password" | "confirmPassword"
  ) => {
    setSignupValues({
      ...signupValues,
      [field]: e.target.value,
    });
  };

  const canLogin = () =>
    Object.values(loginValues).every((value) => value.length > 0);

  const canSignup = () =>
    isMatchingPassword() &&
    Object.values(signupValues).every((value) => value.length > 0);

  const isMatchingPassword = () => {
    if (signupValues.password.length > 0) {
      return signupValues.confirmPassword === signupValues.password;
    }
    return true;
  };

  const handleLoginSubmit = () => {
    setIsLoading(true);
    setLoginError("");
    axios
      .post("/storymap-api/users/login", {
        email: loginValues.email,
        password: loginValues.password,
      })
      .then((result) => {
        const userObj = { ...result.data.user, token: result.data.token };
        setCurrentUser(userObj);
        history.push("/");
      })
      .catch((e) => {
        if (e.request?.responseText?.includes("Invalid email format")) {
          setLoginError("Invalid email format.");
        } else if (e.response.status === 401) {
          setLoginError("Email or password incorrect.");
        } else {
          setLoginError("Oops! Something went wrong.");
        }
        setIsLoading(false);
      });
  };

  const handleSignupSubmit = () => {
    setIsLoading(true);
    setSignupError("");
    axios
      .post("/storymap-api/users", {
        username: signupValues.username,
        email: signupValues.email,
        password: signupValues.password,
        avatar: signupValues.avatar,
      })
      .then((result) => {
        setSignupSuccess(true);
      })
      .catch((e) => {
        if (
          e.request?.responseText?.includes(
            "Password must be at least 6 and at most 100 characters long."
          )
        ) {
          setSignupError("Password must be 6-100 characters.");
        } else if (e.request?.responseText?.includes("Invalid email format")) {
          setSignupError("Invalid email format.");
        } else if (e.response.status === 409) {
          setSignupError(e.response.data);
        } else {
          setSignupError("Oops! Something went wrong.");
        }
        setIsLoading(false);
      });
  };

  return (
    <Paper className={classes.root}>
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        indicatorColor="primary"
        textColor="primary"
        centered
      >
        <Tab label="Login" disabled={isLoading} />
        <Tab label="Sign Up" disabled={isLoading} />
      </Tabs>
      <TabPanel value={tabValue} index={0}>
        <div className={classes.formContainer}>
          <TextField
            placeholder="email"
            variant="outlined"
            size="small"
            value={loginValues.email}
            onChange={(e) => handleLoginTextFieldChange(e, "email")}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MailOutlineIcon fontSize={"small"} />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            placeholder="password"
            variant="outlined"
            type={"password"}
            size="small"
            value={loginValues.password}
            onChange={(e) => handleLoginTextFieldChange(e, "password")}
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
          {loginError}
        </Typography>
        <div className={classes.btnAndPassowrdLinkContainer}>
          <Link
            href="/change-password"
            variant="subtitle2"
            color="textPrimary"
            style={{ marginLeft: 16 }}
          >
            Forgot password?
          </Link>
          <div className={classes.btnContainer}>
            <Button
              size="small"
              variant={"contained"}
              color={"primary"}
              disabled={!canLogin() || isLoading}
              onClick={() => handleLoginSubmit()}
            >
              {isLoading ? <CircularProgress size={20} /> : "Login"}
            </Button>
          </div>
        </div>
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        {signupSuccess && (
          <div className={classes.verificationEmailMsgContainer}>
            <Typography> Hey {signupValues.username}!</Typography>
            <br />
            <Typography>
              A verification email has been sent to {signupValues.email}.
            </Typography>
            <Typography>
              Click the link in the email to complete signup.
            </Typography>
          </div>
        )}
        {!signupSuccess && (
          <>
            <div className={classes.formContainer}>
              <TextField
                placeholder="username"
                variant="outlined"
                size="small"
                value={signupValues.username}
                onChange={(e) => handleSignupTextFieldChange(e, "username")}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonOutlineIcon fontSize={"small"} />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                placeholder="email"
                variant="outlined"
                size="small"
                value={signupValues.email}
                onChange={(e) => handleSignupTextFieldChange(e, "email")}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MailOutlineIcon fontSize={"small"} />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                placeholder="password"
                variant="outlined"
                type={"password"}
                size="small"
                value={signupValues.password}
                onChange={(e) => handleSignupTextFieldChange(e, "password")}
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
                helperText={
                  !isMatchingPassword() ? "Passwords must match" : null
                }
                value={signupValues.confirmPassword}
                onChange={(e) =>
                  handleSignupTextFieldChange(e, "confirmPassword")
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <VpnKeyIcon fontSize={"small"} />
                    </InputAdornment>
                  ),
                }}
              />
              <AvatarSelector
                onSelect={(selected) =>
                  setSignupValues({
                    ...signupValues,
                    avatar: selected,
                  })
                }
                selected={signupValues.avatar}
              />
            </div>
            <Typography style={{ margin: 16 }} color={"error"}>
              {signupError}
            </Typography>
            <div className={classes.btnContainer}>
              <Button
                size="small"
                variant={"contained"}
                color={"primary"}
                disabled={!canSignup() || isLoading}
                onClick={() => handleSignupSubmit()}
              >
                {isLoading ? <CircularProgress size={20} /> : "Sign Up"}
              </Button>
            </div>
          </>
        )}
      </TabPanel>
    </Paper>
  );
}
