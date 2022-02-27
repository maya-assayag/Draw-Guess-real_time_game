import http from "./httpService";
import config from "../config.json";

const apiEndpoint = `/api/user`;

function userUrl(id) {
  return `${apiEndpoint}/${id}`;
}

export async function saveUser(user) {
  if (user._id) {
    const body = { ...user };
    delete body._id;
    delete body.__v;
    return http.put(userUrl(user._id), body);
  }

  const { data } = await http.post(apiEndpoint, user);

  return data;
}

export async function getUsers() {
  const { data: users } = await http.get(apiEndpoint);
  return users;
}

export async function getUser(id) {
  const { data: user } = await http.get(userUrl(id));
  return user;
}

export async function register(user) {
  return await http.post(apiEndpoint, user);
}

export async function deleteUser(id) {
  const { data: user } = await http.delete(userUrl(id));

  return user;
}
