import axios from 'axios';
import * as jsdom from 'jsdom';
import { AnimeSubsApiResponse, AnimeSubsEpisode } from '../interfaces';
import { AxiosClient } from '../api/axiosClient';

const { JSDOM } = jsdom;
const virtualConsole = new jsdom.VirtualConsole();
virtualConsole.on('error', () => {
  // No-op to skip console errors.
});

const MioroSubs = async (anime: string, episode: string): Promise<AnimeSubsApiResponse> => {
  try {
    const baseURL = `https://miorosubs.7m.pl/${anime}-${episode}`;
    const { data } = await new AxiosClient(baseURL).get<string>({
      headers: {
        Referer: baseURL,
        'X-Requested-With': 'XMLHttpRequest',
      },
    });
    const dom = new JSDOM(data, { virtualConsole });

    let episode_cleaning: AnimeSubsEpisode[] = [];
    const items = dom.window.document.querySelector('#mirror')!.querySelectorAll('option');

    items.forEach((item) => {
      const player = item.textContent!.split(' ')[0];
      const url = item.value;
      if (!player || !url) return null;
      episode_cleaning.push({
        player,
        url,
      });
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
export default MioroSubs;
