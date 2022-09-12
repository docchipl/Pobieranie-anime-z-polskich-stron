import axios from 'axios';
import * as jsdom from 'jsdom';
import { AnimeSubsApiResponse } from '../interfaces';

const { JSDOM } = jsdom;
const virtualConsole = new jsdom.VirtualConsole();
virtualConsole.on('error', () => {
  // No-op to skip console errors.
});

function MioroSubs(anime: string, episode: string): Promise<AnimeSubsApiResponse> {
  const request = axios
    .get(`https://miorosubs.7m.pl/${anime}-${episode}`, {
      headers: {
        Referer: `https://miorosubs.7m.pl/${anime}-${episode}`,
        'X-Requested-With': 'XMLHttpRequest',
      },
    })
    .then(function (response) {
      const dom = new JSDOM(response.data, { virtualConsole });

      let episode_url_cleaning = [];
      const items = dom.window.document.querySelector('#mirror')!.querySelectorAll('option');
      for (var i = 0; i < items.length; ++i) {
        episode_url_cleaning.push({
          player: items[i].textContent!.split(' ')[0],
          url: items[i].value,
        });
      }

      return {
        status: 200,
        message: 'Success',
        episode_url: episode_url_cleaning,
        episode_next_url: `${Number(episode) + 1}`,
      };
    })
    .catch((err) => {
      //console.log(err)
      return {
        status: 500,
        message: 'Something went wrong!',
      };
    });

  return request;
}
export default MioroSubs;
