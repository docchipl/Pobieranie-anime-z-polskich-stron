import axios from 'axios';
import * as jsdom from 'jsdom';

const { JSDOM } = jsdom;
const virtualConsole = new jsdom.VirtualConsole();
virtualConsole.on('error', () => {
  // No-op to skip console errors.
});

function MaouSubs(episode: string) {
  const request = axios
    .get(`https://maousubs.pythonanywhere.com/episode/${episode}`, {
      headers: {
        Referer: `https://maousubs.pythonanywhere.com/episode/${episode}`,
        'X-Requested-With': 'XMLHttpRequest',
      },
    })
    .then(function (response) {
      const dom = new JSDOM(response.data, { virtualConsole });
      const episodeNumber = Number(
        dom.window.document.querySelector('h3#postdata .mobile-text-long')?.textContent?.replace('Odcinek:', ''),
      );
      const items = dom.window.document.querySelectorAll('#btn-PLCGMDM');
      let episode_url_cleaning = [];
      let episode_next_url = null;
      const episodes = dom.window.document.querySelectorAll('.flex-container-video .between');

      for (var i = 0; i < items.length; ++i) {
        episode_url_cleaning.push({
          player: items[i].textContent,
          url: items[i].getAttribute('data-embed'),
        });
      }

      for (var y = 0; y < episodes.length; ++y) {
        const episodeN = Number(episodes[y].textContent?.replace('Odcinek:', ''));

        if (episodeN === episodeNumber + 1) {
          episode_next_url = episodes[y].querySelector('a')?.href.replace('/episode/', '');
        }
      }

      return {
        status: 200,
        message: 'Success',
        episode_number: episodeNumber,
        episode_url: episode_url_cleaning,
        episode_next_url: episode_next_url,
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
export default MaouSubs;
