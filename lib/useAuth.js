import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectUser, setUser } from "./features/user/userSlice";
import { authStateListener } from "@/app/db/auth";

function useAuth() {

  const currentUser = useSelector(selectUser);
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = authStateListener((user) => {
      dispatch(setUser({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
      }));
    });

    return () => {
      unsubscribe();
    }
  }, [dispatch]);

  return currentUser;
}

export default useAuth;