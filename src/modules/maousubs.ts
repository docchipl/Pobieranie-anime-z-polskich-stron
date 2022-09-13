import axios from 'axios';
import * as jsdom from 'jsdom';
import { AnimeSubsApiResponse, AnimeSubsEpisode } from '../interfaces';
import { AxiosClient } from '../api/axiosClient';

const { JSDOM } = jsdom;
const virtualConsole = new jsdom.VirtualConsole();
virtualConsole.on('error', () => {
  // No-op to skip console errors.
});

const MaouSubs = async (episode: string): Promise<AnimeSubsApiResponse> => {
  try {
    const { data } = await new AxiosClient(`https://maousubs.pythonanywhere.com/episode/${episode}`).get<string>();
    const dom = new JSDOM(data, { virtualConsole });
    const episodeNumber = Number(
      dom.window.document.querySelector('h3#postdata .mobile-text-long')!.textContent!.replace('Odcinek:', ''),
    );
    const items = dom.window.document.querySelectorAll('#btn-PLCGMDM');
    let episode_cleaning: AnimeSubsEpisode[] = [];
    let episode_next_url = null;
    const episodes = dom.window.document.querySelectorAll('.flex-container-video .between');

    items.forEach((item) => {
      const player = item.textContent;
      const url = item.getAttribute('data-embed');
      if (!player || !url) return null;
      episode_cleaning.push({
        player,
        url,
      });
    });

    episodes.forEach((episode) => {
      const episodeN = Number(episode.textContent!.replace('Odcinek:', ''));

      if (episodeN === episodeNumber + 1) {
        episode_next_url = episode.querySelector('a')!.href.replace('/episode/', '');
      }
    });

    return {
      status: 200,
      message: 'Success',
      episode: episode_cleaning,
      episode_next_url: episode_next_url,
    };
  } catch {
    return {
      status: 500,
      message: 'Something went wrong!',
    };
  }
};
export default MaouSubs;
