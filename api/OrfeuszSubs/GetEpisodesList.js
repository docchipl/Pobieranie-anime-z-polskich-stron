import axios from "axios";

export default function GetEpisodesList(anime) {
  const request = axios
    .get(`https://api.orfeusz-subs.pl/api/episode/list?id=${anime}`, {
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