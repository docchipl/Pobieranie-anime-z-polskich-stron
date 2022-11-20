import axios from 'axios';
import jsdom  from 'jsdom';

const { JSDOM } = jsdom;
const virtualConsole = new jsdom.VirtualConsole();
virtualConsole.on("error", () => {
  // No-op to skip console errors.
});

function OkamiSubs (anime, episode){
    const request = axios.get(`https://okami-subs.pl/anime/${anime}/odcinek/${episode}`).then(async function (response) {
        const dom = new JSDOM(response.data, { runScripts: 'dangerously', virtualConsole }).window;
        let episode_url_cleaning = [];
        const okamiData = dom.InitData;
        let episode_next_url;

        await Promise.all(
          okamiData.episode_links.map(async function(x) {
            episode_url_cleaning.push({
                player: x.player,
                url: x.url
            });
          })
        )

        if(dom.document.querySelector('.col-md-4.col-xs-12 .button.pull-right')){
          episode_next_url = dom.document.querySelector('.col-md-4.col-xs-12 .button.pull-right').href.split("/").pop();
        }else{
          episode_next_url = null;
        }

        return ({
          status: 200, 
          message: "Success",
          episode_url: episode_url_cleaning,
          episode_next_url: episode_next_url
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
export default OkamiSubs;