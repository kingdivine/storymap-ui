import React, { useState } from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { Box, Button, InputAdornment, TextField } from "@material-ui/core";
//icons
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import PersonOutlineIcon from "@material-ui/icons/PersonOutline";
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
    },
    btnContainer: {
      display: "flex",
      justifyContent: "flex-end",
      margin: theme.spacing(2),
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
  const [tabValue, setTabValue] = useState(0);

  const [loginValues, setLoginValues] = useState({
    email: "",
    password: "",
  });
  const [signUpValues, setSignUpValues] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
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

  const handleSignUpTextFieldChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
    field: "username" | "email" | "password" | "confirmPassword"
  ) => {
    setSignUpValues({
      ...signUpValues,
      [field]: e.target.value,
    });
  };

  const canSignUp = () =>
    isMatchingPassword() &&
    Object.values(signUpValues).every((value) => value.length > 0);

  const isMatchingPassword = () => {
    if (signUpValues.password.length > 0) {
      return signUpValues.confirmPassword === signUpValues.password;
    }
    return true;
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
        <Tab label="Login" />
        <Tab label="Sign Up" />
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
        <div className={classes.btnContainer}>
          <Button size="small" variant={"contained"} color={"primary"}>
            Login
          </Button>
        </div>
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <div className={classes.formContainer}>
          <TextField
            placeholder="username"
            variant="outlined"
            size="small"
            value={signUpValues.username}
            onChange={(e) => handleSignUpTextFieldChange(e, "username")}
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
            value={signUpValues.email}
            onChange={(e) => handleSignUpTextFieldChange(e, "email")}
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
            size="small"
            value={signUpValues.password}
            onChange={(e) => handleSignUpTextFieldChange(e, "password")}
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
            size="small"
            error={!isMatchingPassword()}
            helperText={!isMatchingPassword() ? "Passwords must match" : null}
            value={signUpValues.confirmPassword}
            onChange={(e) => handleSignUpTextFieldChange(e, "confirmPassword")}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <VpnKeyIcon fontSize={"small"} />
                </InputAdornment>
              ),
            }}
          />
        </div>
        <div className={classes.btnContainer}>
          <Button
            size="small"
            variant={"contained"}
            color={"primary"}
            disabled={!canSignUp()}
          >
            Sign Up
          </Button>
        </div>
      </TabPanel>
    </Paper>
  );
}
