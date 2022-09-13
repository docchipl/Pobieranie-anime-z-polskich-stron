import axios, { Axios } from 'axios';
import * as jsdom from 'jsdom';
import { AnimeSubsApiResponse } from '../interfaces';
import { AxiosClient } from '../api/axiosClient';

const { JSDOM } = jsdom;
const virtualConsole = new jsdom.VirtualConsole();
virtualConsole.on('error', () => {
  // No-op to skip console errors.
});

const DayidSub = async (anime: string, episode: string): Promise<AnimeSubsApiResponse> => {
  try {
    const baseURL = `https://dayidsub.pl/${anime}/episode${episode}`;
    const { data } = await new AxiosClient(baseURL).get<string>({
      headers: {
        Referer: baseURL,
        'X-Requested-With': 'XMLHttpRequest',
      },
    });
    const dom = new JSDOM(data, { virtualConsole });

    let episode_url_cleaning;
    const items = dom.window.document.querySelectorAll('.episode .links');
    const next_url = (dom.window.document.querySelector('.pageNav .right a') as HTMLAnchorElement)?.href.replace(
      /[A-Za-z]/g,
      '',
    );
    items.forEach((item) => {
      const string = item.textContent;
      const matches = string?.match(/\bhttps?:\/\/\S+/gi);
      episode_url_cleaning = matches?.map((x) => {
        const url = new URL(x);
        if (url.host.split('.').length === 3) {
          return {
            player: url.host
              .replace(/^[^.]+\./g, '')
              .split('.')[0]
              .toUpperCase(),
            url: x,
          };
        } else {
          return {
            player: url.host.split('.')[0].toUpperCase(),
            url: x,
          };
        }
      });
    });

    return {
      status: 200,
      message: 'Success',
      episode: episode_url_cleaning,
      episode_next_url: next_url === ':#' ? null : next_url,
    };
  } catch {
    return {
      status: 500,
      message: 'Something went wrong!',
    };
  }
};
export default DayidSub;
