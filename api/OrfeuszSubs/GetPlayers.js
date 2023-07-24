import axios from "axios";

export default function GetPlayers(episode_id) {
  const request = axios
    .get(`https://api.orfeusz-subs.pl/api/player/list?id=${episode_id}`, {
      headers: {
        Accept: `application/json`,
      },
    })
    .then(function (response) {
      if (response.status === 200) {
        return response.data;
      }

      return null;
    })
    .catch((err) => {
      return null;
    });

  return request;
}
