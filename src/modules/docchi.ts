import { AxiosClient } from '../api';
import { AnimeSubsApiResponse } from '../interfaces';

interface DocchiResponse {
  id: number;
  anime_id: string;
  anime_episode_number: number;
  player: string;
  player_hosting: string;
  created_at: Date;
  translator: string;
  translator_title: string;
  translator_url: string;
}

export const DocchiSubs = async (anime: string, episode: string): Promise<AnimeSubsApiResponse> => {
  try {
    const baseURL = `https://api.docchi.pl/api/episodes/find/${anime}/${episode}`;
    const { data } = await new AxiosClient(baseURL).get<DocchiResponse[]>({
      headers: {
        Accept: `application/json`,
      },
    });
    const mappedEpisodes = data.map((episode) => {
      return {
        player: episode.player_hosting,
        url: episode.player,
      };
    });
    return {
      status: 200,
      message: 'Success',
      episodes: mappedEpisodes,
      episode_next_url: `https://api.docchi.pl/api/episodes/find/${anime}/${episode + 1}`,
    };
  } catch {
    return {
      status: 500,
      message: 'Something went wrong!',
    };
  }
};
