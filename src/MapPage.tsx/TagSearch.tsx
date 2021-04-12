import { TextField, Typography } from "@material-ui/core";
import axios from "axios";
import { useEffect, useState } from "react";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { Tag } from "./Filter";

export default function UserSearch(props: { onTagSelect: (tag: Tag) => void }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [options, setOptions] = useState<Tag[]>([]);
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
        const response = await axios.get(`/storymap-api/tags/`);
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
        getOptionLabel={(option) => `#${option.title}`}
        options={options}
        autoComplete
        onChange={(event: any, newValue: Tag | null) => {
          if (newValue) {
            props.onTagSelect(newValue);
          }
        }}
        getOptionSelected={(option, value) => option.id === value.id}
        onInputChange={(event, newSearchTerm) => {
          setSearchTerm(newSearchTerm);
        }}
        loading={isLoading}
        renderInput={(params) => (
          <TextField {...params} label="Tag" variant="outlined" />
        )}
        renderOption={(option) => (
          <div>
            <Typography variant="body1"> {`#${option.title}`}</Typography>
          </div>
        )}
      />
    </>
  );
}
