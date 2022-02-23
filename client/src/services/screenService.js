import http from "./httpService";
import config from "../config.json";
import { getJwt } from "./authService";

const apiEndpoint = `${config.apiUrl}/screen`;

function screenUrl(id) {
  return `${apiEndpoint}/${id}`;
}

export async function getAdvertisementsOnScreen(screen) {
  const { data: screens } = await http.get(screenUrl(screen._id), {
    headers: {
      "x-auth-token": getJwt()
    }
  });
  return screens.map(screen => screen.advertisements);
}

export async function getScreens() {
  const { data: screens } = await http.get(apiEndpoint, {
    headers: {
      "x-auth-token": getJwt()
    }
  });

  return screens;
}
export async function getScreen(id) {
  return await http
    .get(screenUrl(id))
    .find(advertisement => advertisement._id === id);
}

export async function createScreen() {
  const screen = {
    connections: [],
    advertisements: []
  };
  return await http.post(apiEndpoint, screen, {
    headers: {
      "x-auth-token": getJwt()
    }
  });
}

export async function addConnectionToScreen(screen, connection) {
  console.log(connection);
  return await http.put(screenUrl(screen), connection, {
    headers: {
      "x-auth-token": getJwt()
    }
  });
}

export async function deleteScreen(id) {
  const { data: advertisement } = await http.delete(screenUrl(id), {
    headers: {
      "x-auth-token": getJwt()
    }
  });

  return advertisement;
}
