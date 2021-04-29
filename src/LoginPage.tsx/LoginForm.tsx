import React from "react";
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
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Paper className={classes.root}>
      <Tabs
        value={value}
        onChange={handleChange}
        indicatorColor="primary"
        textColor="primary"
        centered
      >
        <Tab label="Login" />
        <Tab label="Sign Up" />
      </Tabs>
      <TabPanel value={value} index={0}>
        <div className={classes.formContainer}>
          <TextField
            placeholder="email"
            variant="outlined"
            size="small"
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
      <TabPanel value={value} index={1}>
        <div className={classes.formContainer}>
          <TextField
            placeholder="username"
            variant="outlined"
            size="small"
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
            Sign Up
          </Button>
        </div>
      </TabPanel>
    </Paper>
  );
}
