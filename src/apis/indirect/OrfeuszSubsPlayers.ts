import axios, { AxiosResponse } from "axios";

//Response Interfaces
interface IPlayers {
  source: string;
  iframe: string;
}

//Return Interfaces
interface IPlayer {
  player: string;
  url: string;
}

export default async function OrfeuszSubsPlayers(
  episode: number | string,
  episode_id: number,
  bg?: string | null,
): Promise<{
  status: number;
  message: string;
  episode_thumbnail?: string | null;
  episodes?: IPlayer[];
  episode_next_url?: string | number;
}> {
  try {
    const response: AxiosResponse<IPlayers[]> = await axios.get(
      `https://api.orfeusz-subs.pl/api/player/list?id=${episode_id}`,
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
      episode_thumbnail: bg,
      episodes: response.data.map(function (x) {
        return {
          player: x.source,
          url: x.iframe,
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
