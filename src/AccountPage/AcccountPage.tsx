import { useState } from "react";
import { createStyles, makeStyles, Theme, Typography } from "@material-ui/core";
import Heading from "../Generic/Heading";
import Footer from "../Generic/Footer";

const useStyles = makeStyles((theme: Theme) => createStyles({}));

export default function AccountPage() {
  const classes = useStyles();
  return (
    <>
      <Heading />
      <Footer />
    </>
  );
}
