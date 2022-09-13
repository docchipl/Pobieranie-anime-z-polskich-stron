import { AxiosClient } from '../api';

const DocchiSubs = async (anime: string, episode: string) => {
  try {
    const baseURL = `https://api.docchi.pl/api/episodes/find/${anime}/${episode}`;
    const { data } = await new AxiosClient(baseURL).get<string>({
      headers: {
        Accept: `application/json`,
      },
    });
    return {
      status: 200,
      message: 'Success',
      episode_url: data,
      episode_next_url: Number(episode) + 1,
    };
  } catch {
    return {
      status: 500,
      message: 'Something went wrong!',
    };
  }
};
export default DocchiSubs;
