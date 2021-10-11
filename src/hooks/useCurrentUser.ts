import { useState } from "react";
import jwt from "jsonwebtoken";

interface User {
  id: string;
  email: string;
  username: string;
  token: string;
}

export function useCurrentUser() {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const user = window.localStorage.getItem("currentUser");
      if (user) {
        const userObj = JSON.parse(user) as User;
        const decodedToken: any = jwt.decode(userObj.token);
        if (decodedToken && Date.now() >= decodedToken.exp * 1000) {
          return null;
        }
        return userObj;
      }
      return null;
    } catch (e) {
      console.log(e);
      return null;
    }
  });

  const setUser = (value: User | null) => {
    try {
      setCurrentUser(value);
      if (value) {
        window.localStorage.setItem("currentUser", JSON.stringify(value));
      } else {
        window.localStorage.removeItem("currentUser");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return [currentUser, setUser] as const;
}
