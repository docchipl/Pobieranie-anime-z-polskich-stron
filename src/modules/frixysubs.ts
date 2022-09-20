import { AxiosClient } from '../api';
import { AnimeSubsApiResponse } from '../interfaces';

export const FrixySubs = async (anime: string, episode: string): Promise<AnimeSubsApiResponse> => {
  try {
    const baseURL = `https://frixysubs.pl/api/anime/${anime}/${episode}`;
    const { data } = await new AxiosClient(baseURL).get<any>({
      headers: {
        Accept: `application/json`,
      },
    });
    return {
      status: 200,
      message: 'Success',
      episodes: data.episode.players.map((episode: any) => {
        return {
          player: episode.name,
          url: episode.link,
        };
      }),
      episode_next_url: `https://frixysubs.pl/api/anime/${anime}/${episode + 1}`,
    };
  } catch {
    return {
      status: 500,
      message: 'Something went wrong!',
    };
  }
};
