import http from "./httpService";
import config from "../config.json";
import { getJwt } from "./authService";

const apiEndpoint = `${config.apiUrl}/user`;

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
  const { data: users } = await http.get(apiEndpoint, {
    headers: {
      "x-auth-token": getJwt()
    }
  });
  return users;
}

export async function getUser(id) {
  const { data: user } = await http.get(userUrl(id), {
    headers: {
      "x-auth-token":
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MjBkMzk3ZmE5YTU0ZDc4OGFmOWQ3YTgiLCJyb2xlIjoiQWRtaW4iLCJpYXQiOjE2NDUwMzM4NTh9.IRvxUVgq_3UCakA_t-_hrivsoCmj38_9AsAzbnwsP_8"
    }
  });
  return user;
}

export async function register(user) {
  return await http.post(apiEndpoint, user);
}

export async function deleteUser(id) {
  const { data: user } = await http.delete(userUrl(id), {
    headers: {
      "x-auth-token": getJwt()
    }
  });

  return user;
}
