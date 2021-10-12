import { Typography, Avatar } from "@material-ui/core";

export default function UsernameAndPic(props: {
  username: string;
  userId: string;
}) {
  const { username } = props;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Avatar src="/broken-image.jpg" style={{ marginLeft: -2 }} />
      <Typography style={{ margin: 8 }} color="textPrimary">
        {username}
      </Typography>
    </div>
  );
}
