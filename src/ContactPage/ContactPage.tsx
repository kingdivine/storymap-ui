import { Button, Divider, Link, Typography } from "@material-ui/core";

import StaticPage from "../Generic/StaticPage";

export default function ContactPage() {
  return (
    <StaticPage>
      <Typography variant={"h5"} color="primary">
        Contact
      </Typography>
      <Divider />
      <Typography variant={"body1"}>Need to get in touch?</Typography>

      <Typography variant={"body1"}>
        If you need help or want to provide feedback, do not hesitate to contact
        us at {""}
        <span>
          <Link href="mailto:hello@storymap.co" underline="none">
            hello@storymap.co
          </Link>
        </span>
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
