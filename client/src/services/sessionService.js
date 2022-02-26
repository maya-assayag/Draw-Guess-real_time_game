import http from "./httpService";
import config from "../config.json";

const apiEndpoint = `${config.apiUrl}/session`;

function sessionUrl(id) {
  return `${apiEndpoint}/${id}`;
}

export async function getSessions() {
  const { data: sessions } = await http.get(apiEndpoint);
  return sessions.filter(g => g);
}

export async function getSessionsByUserId(userId) {
  const { data: sessions } = await http.get(apiEndpoint);
  return sessions.filter(session => session.participants.includes(userId));
}

export async function getSession(id) {
  const { data } = await http.get(sessionUrl(id));
  return data;
}

export async function saveSession(session) {
  if (session._id) {
    const body = { ...session };
    delete body._id;
    delete body.__v;
    return http.put(sessionUrl(session._id), body);
  }

  const { data: sessionDB } = await http.post(apiEndpoint, session);

  return sessionDB;
}

export async function deleteSession(id) {
  const { data: session } = await http.delete(sessionUrl(id));

  return session;
}
