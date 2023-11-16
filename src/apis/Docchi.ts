import axios, { AxiosResponse } from "axios";

//Response Interfaces
interface IPlayers {
  bg: string;
  player: string;
  player_hosting: string;
  translator_title: string;
}

//Return Interfaces
interface IPlayer {
  player: string;
  url: string;
}

export default async function Docchi(
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
    const response: AxiosResponse<IPlayers[]> = await axios.get(
      `https://api.docchi.pl/v1/episodes/find/${anime}/${episode}`,
      {
        headers: {
          Accept: `application/json`,
        },
      }
    );

    if (response.data.length <= 0) {
      return {
        status: 500,
        message: "Something went wrong!",
      };
    }

    return {
      status: 200,
      message: "Mission Accomplished!",
      episode_thumbnail: response.data[0].bg ?? null,
      episodes: response.data.map(function (x) {
        return {
          player: x.player_hosting,
          url: x.player,
          translator: x.translator_title.trim() === "" ? "none" : x.translator_title.trim()
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
