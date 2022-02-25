import { getUser, saveUser } from "../services/userService";
export function createUserObject(username) {
  return {
    firstName: "",
    lastName: "",
    username,
    sessions: []
  };
}

export async function addSessionToUsers(score, session) {
  console.log("SESSION:", session);
  let user;
  for (let userId of session.participants) {
    user = await getUser(userId.toString());
    if (user) {
      console.log("USER JUST MOMENT BEFORE", user);
      user.sessions = [
        { score, session: session._id.toString() },
        ...user.sessions
      ];
      console.log("USER JUST MOMENT AFTER", user);
      await saveUser(user);
    }
  }
}
