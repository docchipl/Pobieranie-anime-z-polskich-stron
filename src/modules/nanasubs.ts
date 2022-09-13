import axios from 'axios';
import * as jsdom from 'jsdom';
import { AnimeSubsApiResponse, AnimeSubsEpisode } from '../interfaces';
import { AxiosClient } from '../api/axiosClient';

const { JSDOM } = jsdom;
const virtualConsole = new jsdom.VirtualConsole();
virtualConsole.on('error', () => {
  // No-op to skip console errors.
});

const NanaSubs = async (anime: string, episode: string): Promise<AnimeSubsApiResponse> => {
  try {
    const baseURL = `https://nanasubs.pl/anime/${anime}/odcinki/${episode}`;
    const { data } = await new AxiosClient(baseURL).get<string>({
      headers: {
        Referer: baseURL,
        'X-Requested-With': 'XMLHttpRequest',
      },
    });
    const dom = new JSDOM(data, { virtualConsole });
    const items = dom.window.document.querySelectorAll('#players-btn .episode__players-list span');

    let episode_cleaning: AnimeSubsEpisode[] = [];
    let episode_next: HTMLAnchorElement = dom.window.document.querySelector(
      '.episode__episodes-list .episode__tile a[class="episode__tile-link"]',
    )!;

    let episode_next_url = episode_next.href
      .split('/')
      .pop()!
      .replace(/[A-Za-z]/g, '');

    items.forEach((item) => {
      const player = item.textContent!.toUpperCase();
      const url = item.getAttribute('data-player-url');
      if (!player || !url) return null;
      episode_cleaning.push({
        player,
        url,
      });
    });

    return {
      status: 200,
      message: 'Success',
      episodes: episode_cleaning,
      episode_next_url: episode >= episode_next_url ? null : episode_next_url,
    };
  } catch {
    return {
      status: 500,
      message: 'Something went wrong!',
    };
  }
};
export default NanaSubs;
