import axios, { AxiosResponse } from "axios";

//Response Interfaces
interface IPlayers {
  number: number;
  image: string;
  id: number;
}

export default async function OrfeuszSubsEpisodes(
  anime: string,
  episode: string | number
): Promise<{
  status: number;
  episode_id?: number;
  bg?: string | null;
}> {
  try {
    const response: AxiosResponse<IPlayers[]> = await axios.get(
      `https://api.orfeusz-subs.pl/api/episode/list?id=${anime}`,
      {
        headers: {
          Accept: `application/json`,
        },
      }
    );

    if (response.data.length <= 0) {
      return {
        status: 500,
      };
    }

    const indexOfObject = response.data.findIndex((object) => {
      return object.number === Number(episode);
    });

    if (indexOfObject === -1) {
      return {
        status: 500,
      };
    }

    return {
      status: 200,
      episode_id: response.data[indexOfObject].id,
      bg: null
    };
  } catch (error) {
    return {
      status: 500,
    };
  }
}
