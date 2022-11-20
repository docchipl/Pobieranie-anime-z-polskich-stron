import axios from 'axios';
import jsdom from 'jsdom';

const { JSDOM } = jsdom;
const virtualConsole = new jsdom.VirtualConsole();
virtualConsole.on("error", () => {
  // No-op to skip console errors.
});

//decode base64 player :)

function Desuonline (anime, episode){
    const request = axios.get(`https://desu-online.pl/${anime}-odcinek-${episode}`, {
        headers: {
          Referer: `https://desu-online.pl/${anime}-odcinek-${episode}`,
          'X-Requested-With': 'XMLHttpRequest',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36'
        }
      }).then(async function (response) {
        const dom = new JSDOM(response.data, { virtualConsole });
        const items = dom.window.document.querySelectorAll(".mobius select.mirror option");
        let episode_url_cleaning = [];

        await Promise.all(
          Array.from(items).map(async function(x) {
            if(x.textContent.toLocaleLowerCase().includes("wybierz")) return;

            episode_url_cleaning.push({
                player: x.textContent.toUpperCase().replaceAll("\n", "").trim(),
                url: Buffer.from(x.value, 'base64').toString("utf8").match(/(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/igm)[0]
            });
          })
        )

        return ({
          status: 200, 
          message: "Success",
          episode_url: episode_url_cleaning,
          episode_next_url: episode+1
        })
      }).catch(err => {
        //console.log(err)
        return ({
            status: 500,
            message: "Something went wrong!"
        })
      });

      return (request);
}
export default Desuonline;