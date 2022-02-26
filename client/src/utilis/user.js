import { getUser, saveUser, getUsers } from "../services/userService";
export function createUserObject(username) {
  return {
    firstName: "",
    lastName: "",
    username,
    sessions: []
  };
}

export async function getUserByUsername(username) {
  const users = await getUsers();
  return users.find(user => user.username === username);
}

export async function addSessionToUsers(session) {
  let user;
  for (let userId of session.participants) {
    user = await getUser(userId.toString());
    if (user) {
      user.sessions = [session._id.toString(), ...user.sessions];
      await saveUser(user);
    }
  }
}
