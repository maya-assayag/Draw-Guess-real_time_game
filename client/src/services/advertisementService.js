import http from "./httpService";
import config from "../config.json";
import { getJwt } from "./authService";

const apiEndpoint = `${config.apiUrl}/advertisement`;

function advertisementUrl(id) {
  return `${apiEndpoint}/${id}`;
}

export async function getTopics() {
  const { data: advertisements } = await http.get(apiEndpoint, {
    headers: {
      "x-auth-token": getJwt()
    }
  });
  const topics = [
    ...new Set(advertisements.map(advertisement => advertisement.topic))
  ];
  return topics;
}

export async function getAdvertisements() {
  const { data: advertisements } = await http.get(apiEndpoint, {
    headers: {
      "x-auth-token":
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MjBkNjE3M2UwMWRjOWI4MmJiM2MxODAiLCJyb2xlIjoiQWRtaW4iLCJpYXQiOjE2NDUwNDQwODh9.xO4HTNAXZLBlzvHUwj6gRr3-TQryIi8rqJpIoe-Bz8g"
    }
  });
  return advertisements.filter(g => g);
}

export async function getAdvertisementsByScreenId(screenId) {
  const { data: advertisements } = await http.get(apiEndpoint, {
    headers: {
      "x-auth-token":
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MjBkNjE3M2UwMWRjOWI4MmJiM2MxODAiLCJyb2xlIjoiQWRtaW4iLCJpYXQiOjE2NDUwNDQwODh9.xO4HTNAXZLBlzvHUwj6gRr3-TQryIi8rqJpIoe-Bz8g"
    }
  });
  return advertisements.filter(g => g.screens.includes(screenId));
}

export async function getAdvertisement(id) {
  return await http
    .get(advertisementUrl(id))
    .find(advertisement => advertisement._id === id);
}

export async function saveAdvertisement(advertisement) {
  if (advertisement._id) {
    const body = { ...advertisement };
    delete body._id;
    return http.put(advertisementUrl(advertisement._id), body);
  }

  await http.post(apiEndpoint, advertisement, {
    headers: {
      "x-auth-token": getJwt()
    }
  });

  return advertisement;
}

export async function deleteAdvertisement(id) {
  const { data: advertisement } = await http.delete(advertisementUrl(id), {
    headers: {
      "x-auth-token": getJwt()
    }
  });

  return advertisement;
}
