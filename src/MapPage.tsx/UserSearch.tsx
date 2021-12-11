import { useEffect, useState } from "react";
import axios from "axios";
import { TextField } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { User } from "../types/User";
import UsernameAndPic from "../Generic/UsernameandPic";
import { storymapApiUrl } from "../utils";

export default function UserSearch(props: {
  onUserSelect: (user: User) => void;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [options, setOptions] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setOptions([]);
      return;
    }
    const timeoutID = setTimeout(() => {
      fetchData(searchTerm.trim());
    }, 500);

    const fetchData = async (searchString: string) => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${storymapApiUrl}/users/`, {
          params: {
            username: searchString,
            offset: 0,
          },
        });
        setOptions(response.data);
      } catch (e) {
        console.log(e);
      } finally {
        setIsLoading(false);
      }
    };
    return () => {
      clearTimeout(timeoutID);
    };
  }, [searchTerm]);

  return (
    <>
      <Autocomplete
        style={{ width: 150 }}
        size={"small"}
        getOptionLabel={(option) => `@${option.username}`}
        options={options}
        autoComplete
        onChange={(event: any, newValue: User | null) => {
          if (newValue) {
            props.onUserSelect(newValue);
          }
        }}
        getOptionSelected={(option, value) => option.id === value.id}
        onInputChange={(event, newSearchTerm) => {
          setSearchTerm(newSearchTerm);
        }}
        popupIcon={null}
        noOptionsText={"No users found."}
        loading={isLoading}
        renderInput={(params) => (
          <TextField {...params} label="Username" variant="outlined" />
        )}
        renderOption={(option) => (
          <UsernameAndPic
            userId={option.id}
            username={option.username}
            avatar={option.avatar}
            small
            noLink
          />
        )}
      />
    </>
  );
}
