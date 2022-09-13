import axios from 'axios';
import * as jsdom from 'jsdom';
import { AnimeSubsApiResponse, AnimeSubsEpisode } from '../interfaces';
import { AxiosClient } from '../api/axiosClient';

const { JSDOM } = jsdom;
const virtualConsole = new jsdom.VirtualConsole();
virtualConsole.on('error', () => {
  // No-op to skip console errors.
});

const FumetsuSubs = async (anime: string, episode: string): Promise<AnimeSubsApiResponse> => {
  try {
    const { data } = await new AxiosClient(`https://fumetsu.pl/anime/${anime}/${episode}`).get<string>();
    const dom = new JSDOM(data, { virtualConsole });
    let episode_cleaning: AnimeSubsEpisode[] = [];
    const items = dom.window.document.querySelectorAll('.video_cont iframe');
    items.forEach((item) => {
      const string = (item as HTMLVideoElement).src;

      const url = new URL(string);
      if (url.host.split('.').length === 3) {
        episode_cleaning.push({
          player: url.host
            .replace(/^[^.]+\./g, '')
            .split('.')[0]
            .toUpperCase(),
          url: string,
        });
      } else {
        episode_cleaning.push({
          player: url.host.split('.')[0].toUpperCase(),
          url: string,
        });
      }
    });

    return {
      status: 200,
      message: 'Success',
      episode: episode_cleaning,
      episode_next_url: `${Number(episode) + 1}`,
    };
  } catch {
    return {
      status: 500,
      message: 'Something went wrong!',
    };
  }
};
export default FumetsuSubs;
