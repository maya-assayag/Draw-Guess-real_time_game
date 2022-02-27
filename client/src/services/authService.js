import http from "./httpService";
import config from "../config.json";
import jwtDecode from "jwt-decode";

const apiEndpoint = `${config.apiUrl}/api/auth`;
const tokenKey = "token";

export async function login(user) {
  const { data: jwt } = await http.post(apiEndpoint, user);

  localStorage.setItem(tokenKey, jwt);
}

export function loginWithJwt(jwt) {
  localStorage.setItem(tokenKey, jwt);
}

export function getJwt() {
  return localStorage.getItem(tokenKey);
}

export function logout() {
  localStorage.removeItem(tokenKey);
}

export function getCurrentUser() {
  try {
    const jwt = localStorage.getItem(tokenKey);
    const user = jwtDecode(jwt);
    return user;
  } catch (error) {
    return null;
  }
}
