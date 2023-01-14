import axios from 'axios';
import jsdom from 'jsdom';

const { JSDOM } = jsdom;
const virtualConsole = new jsdom.VirtualConsole();
virtualConsole.on("error", () => {
    //console.log(e)
  // No-op to skip console errors.
});

function Grupamirai (anime, episode){
    const request = axios.get(`https://www.grupa-mirai.pl/${anime}`, {
        headers: {
          Referer: `https://www.grupa-mirai.pl/${anime}`,
          'X-Requested-With': 'XMLHttpRequest',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36'
        }
      }).then(async function (response) {
        const dom = new JSDOM(response.data, { runScripts: 'dangerously', virtualConsole }).window;
        let episode_url_cleaning = [];
        const cdaPlayer = dom.epCda || dom.epCDA;
        const megaPlayer = dom.epMega;
        const sibnetPlayer = dom.epSibnet;

        if(cdaPlayer && cdaPlayer[episode]){
            episode_url_cleaning.push({
                player: "CDA",
                url: "https://ebd.cda.pl/620x395/"+cdaPlayer[episode]
            });
        }
        
        if(megaPlayer && megaPlayer[episode]){
            episode_url_cleaning.push({
                player: "MEGA",
                url: "https://mega.nz/embed/"+megaPlayer[episode]
            });
        }

        if(sibnetPlayer && sibnetPlayer[episode]){
            episode_url_cleaning.push({
                player: "SIBNET",
                url: "https://video.sibnet.ru/shell.php?videoid="+sibnetPlayer[episode]
            });
        }

        if (episode_url_cleaning.length === 0){
            return ({
                status: 500,
                message: "Something went wrong!"
            })
        }

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
export default Grupamirai;