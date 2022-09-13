import axios from 'axios';
import * as jsdom from 'jsdom';
import { AxiosClient } from '../api/axiosClient';

const { JSDOM } = jsdom;
const virtualConsole = new jsdom.VirtualConsole();
virtualConsole.on('error', () => {
  // No-op to skip console errors.
});

const OkamiSubs = async (anime: string, episode: string) => {
  try {
    const { data } = await axios.get(`https://okami-subs.pl/anime/${anime}/odcinek/${episode}`);
    const dom = new JSDOM(data, { virtualConsole });

    const episode_cleaning = JSON.parse(
      '[' + dom.window.document.getElementsByTagName('script')[4].textContent!.match(/\[(.+)\]/)![1] + ']',
    );
    let episode_next_url;

    if (dom.window.document.querySelector('.col-md-4.col-xs-12 .button.pull-right')) {
      episode_next_url = (dom.window.document.querySelector(
        '.col-md-4.col-xs-12 .button.pull-right',
      ) as HTMLAnchorElement)!.href;
    } else {
      episode_next_url = null;
    }

    const episode_url = episode_cleaning.map((x: any) => {
      return {
        player: x.player,
        url: x.url,
      };
    });
    return {
      status: 200,
      message: 'Success',
      episode_url,
      episode_next_url: episode_next_url,
    };
  } catch {
    return {
      status: 500,
      message: 'Something went wrong!',
    };
  }
};
export default OkamiSubs;
