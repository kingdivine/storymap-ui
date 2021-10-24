import { Typography, Avatar } from "@material-ui/core";

const AVATAR_NAMES = [
  "boy-01",
  "boy-02",
  "boy-03",
  "boy-04",
  "boy-05",
  "boy-06",
  "boy-07",
  "boy-08",
  "boy-09",
  "boy-10",
  "boy-11",
  "boy-12",
  "boy-13",
  "boy-14",
  "boy-15",
  "boy-16",
  "boy-17",
  "boy-18",
  "boy-19",
  "boy-20",
  "boy-21",
  "boy-22",
  "boy-23",
  "boy-24",
  "boy-25",
  "girl-01",
  "girl-02",
  "girl-03",
  "girl-04",
  "girl-05",
  "girl-06",
  "girl-07",
  "girl-08",
  "girl-09",
  "girl-10",
  "girl-11",
  "girl-12",
  "girl-13",
  "girl-14",
  "girl-15",
  "girl-16",
  "girl-17",
  "girl-18",
  "girl-19",
  "girl-20",
  "girl-21",
  "girl-22",
  "girl-23",
  "girl-24",
  "girl-25",
  "girl-26",
];

export default function UsernameAndPic(props: {
  username: string;
  userId: string;
  avatar: string;
}) {
  const { username } = props;
  const validAvatar = AVATAR_NAMES.includes(props.avatar);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {validAvatar ? (
        <Avatar
          alt={props.username}
          src={require(`./images/avatars/${props.avatar}.svg`).default}
        />
      ) : (
        <Avatar alt={props.username} src={"./broken-img"} />
      )}

      <Typography style={{ marginLeft: 8 }} color="textPrimary">
        {username}
      </Typography>
    </div>
  );
}
