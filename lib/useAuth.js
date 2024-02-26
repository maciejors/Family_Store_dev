import { useEffect } from "react";
import { authStateListener } from "@/app/db/auth";
import { deleteUserFromLocalStorage, getUserFromLocalStorage, saveUserInLocalStorage } from "./userLocalStorage";

function useAuth() {

  const currentUser = getUserFromLocalStorage();

  useEffect(() => {
    const unsubscribe = authStateListener((user) => {
      if (user) {
        saveUserInLocalStorage({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
        });

      } else {
        deleteUserFromLocalStorage();
      }
    });

    return () => {
      unsubscribe();
    }
  }, []);

  return currentUser;
}

export default useAuth;