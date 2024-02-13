const key = "user";

export function saveUserInLocalStorage(value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getUserFromLocalStorage() {
  return JSON.parse(localStorage.getItem(key)) || {
    uid: null,
    email: null,
    displayName: null,
  };
}

export function deleteUserFromLocalStorage() {
  localStorage.removeItem(key);
}