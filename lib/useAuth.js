import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectUser, setUser, cleanUser } from "@/lib/features/user/userSlice";
import { authStateListener } from "@/app/db/auth";
import { deleteUserFromLocalStorage, saveUserInLocalStorage } from "./userLocalStorage";

function useAuth() {

  const currentUser = useSelector(selectUser);
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = authStateListener((user) => {
      if (user) {

        const data = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
        }
        dispatch(setUser(data));
        saveUserInLocalStorage(data);

      } else {
        dispatch(cleanUser());
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