import axios from 'axios';
import jsdom  from 'jsdom';

const { JSDOM } = jsdom;
const virtualConsole = new jsdom.VirtualConsole();
virtualConsole.on("error", () => {
  // No-op to skip console errors.
});

function OkamiSubs (anime, episode){
    const request = axios.get(`https://okami-subs.pl/anime/${anime}/odcinek/${episode}`).then(function (response) {
        const dom = new JSDOM(response.data, { virtualConsole });
        const episode_url_cleaning = JSON.parse("["+dom.window.document.getElementsByTagName('script')[4].textContent.match(/\[(.+)\]/)[1]+"]");
        let episode_next_url;

        if(dom.window.document.querySelector('.col-md-4.col-xs-12 .button.pull-right')){
          episode_next_url = dom.window.document.querySelector('.col-md-4.col-xs-12 .button.pull-right').href.split("/").pop();
        }else{
          episode_next_url = null;
        }

        return ({
          status: 200, 
          message: "Success",
          episode_url: episode_url_cleaning.map(function(x) {
            return({
              player: x.player,
              url: x.url
            })
          }),
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