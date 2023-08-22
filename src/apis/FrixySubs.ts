import axios, { AxiosResponse } from "axios";

//Response Interfaces
interface IEpisode {
  poster: string;
  players: IPlayers[];
}
interface IPlayers {
  name: string;
  link: string;
}

//Return Interfaces
interface IPlayer {
  player: string;
  url: string;
}

export default async function FrixySubs(
  anime: string,
  episode: number | string
): Promise<{
  status: number;
  message: string;
  episode_thumbnail?: string | null;
  episodes?: IPlayer[];
  episode_next_url?: string | number;
}> {
  try {
    const response: AxiosResponse<{ episode: IEpisode }> = await axios.get(
      `https://frixysubs.pl/api/anime/${anime}/${episode}`,
      {
        headers: {
          Accept: `application/json`,
        },
      }
    );
    const {
      episode: { poster, players },
    } = response.data;

    if (players.length <= 0) {
      return {
        status: 500,
        message: "Something went wrong!",
      };
    }

    return {
      status: 200,
      message: "Mission Accomplished!",
      episode_thumbnail: poster ?? null,
      episodes: players.map(function (x) {
        return {
          player: x.name,
          url: x.link,
        };
      }),
      episode_next_url: Number(episode) + 1,
    };

  } catch (error) {
    return {
      status: 500,
      message: "Something went wrong!",
    };
  }
}
