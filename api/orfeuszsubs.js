import GetEpisodesList from "./OrfeuszSubs/GetEpisodesList.js";
import GetPlayers from "./OrfeuszSubs/GetPlayers.js";
import CompilePlayerData from "../utils/CompileEpisodeData.js";

export default async function OrfeuszSubs(anime, episode) {
  let episode_url_cleaning = [];
  const episodes = await GetEpisodesList(anime);

  if (episodes === null) {
    return {
      status: 500,
      message: "Something went wrong!",
    };
  }
  const indexOfObject = episodes.findIndex((object) => {
    return object.number === Number(episode);
  });

  if (indexOfObject === -1) {
    return {
      status: 500,
      message: "Something went wrong!",
    };
  }

  const selectedEpisode = episodes[indexOfObject];
  const players = await GetPlayers(selectedEpisode.id);

  if (players === null) {
    return {
      status: 500,
      message: "Something went wrong!",
    };
  }

  await Promise.all(
    Array.from(players).map(async function (x) {
      const data = CompilePlayerData(x.iframe);

      episode_url_cleaning.push({
        player: data.hosting,
        url: data.player_embed,
      });
    })
  );

  if (episode_url_cleaning.length <= 0) {
    return {
      status: 500,
      message: "Something went wrong!",
    };
  }

  return {
    status: 200,
    message: "Success",
    episode_url: episode_url_cleaning,
    episode_next_url: episode + 1,
  };
}