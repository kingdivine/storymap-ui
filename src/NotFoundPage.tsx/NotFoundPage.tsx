import { Button, Divider, Typography } from "@material-ui/core";
import { useHistory } from "react-router";

import NotFoundGif from "./not-found.gif";
import StaticPage from "../Generic/StaticPage";

export default function NotFoundPage() {
  const history = useHistory();
  return (
    <StaticPage>
      <Typography variant={"h5"} color="error">
        404
      </Typography>
      <Divider />
      <Typography variant={"body1"}>A little lost?</Typography>
      <div>
        <img alt="Man with map looking lost" src={NotFoundGif} height={150} />
      </div>
      <Typography variant={"body1"}>
        The URL <em>{history.location.pathname}</em> doesn't exist
      </Typography>
      <Button
        variant="contained"
        href="/"
        color="primary"
        style={{ marginBottom: 24 }}
      >
        Take me home
      </Button>
    </StaticPage>
  );
}
