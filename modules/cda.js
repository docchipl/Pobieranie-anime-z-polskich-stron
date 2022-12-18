import axios from 'axios';
import jsdom from 'jsdom';

const { JSDOM } = jsdom;
const virtualConsole = new jsdom.VirtualConsole();
virtualConsole.on("error", () => {
  // No-op to skip console errors.
});
function CDA (user, folder, type, spaces , episode){
    const request = axios.get(`https://www.cda.pl/${user}/folder/${folder}`, {
        headers: {
          Referer: `https://www.cda.pl/${user}/folder/${folder}`,
          'X-Requested-With': 'XMLHttpRequest'
        }
      }).then(async function (response) {
        const dom = new JSDOM(response.data, { virtualConsole });
        const thumbnails = dom.window.document.querySelectorAll('.list-when-small.tip .thumbnail.viewList-inline .wrapper-thumb-link .thumbnail-link img.thumb');
        const items = dom.window.document.querySelectorAll('.list-when-small.tip .thumbnail.viewList-inline .caption .caption-label');

        let episode_url_cleaning = [];
        let wrongType = false;

        await Promise.all(
          Array.from(items).map(function(x, index) {
            const thumbnailEpisode = thumbnails[index].src.replaceAll("192x108.jpg", "1280x720.jpg");
            if(type.toLowerCase() === "spaces"){
              const player_title = Number(x.querySelector('a').textContent.split(' ')[Number(spaces)]);
  
              /* It's checking if the episode is equal to "all" and if it is, it's pushing the url to the array and
              returning. */
              if(episode === "all"){
                episode_url_cleaning.push({
                  player: "CDA",
                  episode_number: player_title,
                  url: `https://www.cda.pl${x.querySelector('a').href}`,
                  episode_thumbnail: thumbnailEpisode || null,
                });

                return;
              }

              /* Checking if the episode number is the same as the one you are looking for. */
              if(player_title !== Number(episode)) return;
  
              /* Pushing the url to the array. */
              episode_url_cleaning.push({
                player: "CDA",
                url: `https://www.cda.pl${x.querySelector('a').href}`,
                episode_thumbnail: thumbnailEpisode || null,
              });
  
            }else if(type.toLowerCase() === "s0e0"){
              const player_title = Number(x.querySelector('a').textContent.split(' ')[Number(spaces)].replace(/[A-Za-z]/g, " ").split(" ")[2]);
  
              /* It's checking if the episode is equal to "all" and if it is, it's pushing the url to the array and
              returning. */
              if(episode === "all"){
                episode_url_cleaning.push({
                  player: "CDA",
                  episode_number: player_title,
                  url: `https://www.cda.pl${x.querySelector('a').href}`,
                  episode_thumbnail: thumbnailEpisode || null,
                });

                return;
              }
              
              /* Checking if the episode number is the same as the one you are looking for. */
              if(player_title !== Number(episode)) return;
  
              /* Pushing the url to the array. */
              episode_url_cleaning.push({
                player: "CDA",
                url: `https://www.cda.pl${x.querySelector('a').href}`,
                episode_thumbnail: thumbnailEpisode || null,
              });
            }else{
              wrongType = true;
            }
          })
        )
        
        /* It's checking if the type is wrong and if it is, it's returning a status 400. If the type is
        correct, it's checking if the episode_url_cleaning array is empty and if it is, it's returning a
        status 204. If the array is not empty, it's returning a status 200 and the array. */
        if(wrongType === true){
          return ({
            status: 400, 
            message: "Unknown type of request. Acceptable (spaces, s0e0)"
          })
        }else if(episode_url_cleaning.length === 0){
          return ({
            status: 204, 
            message: "No Content!"
          })
        }else{
          return ({
            status: 200, 
            message: "Success",
            // episode_thumbnail: thumbnails[index] || null,
            episode_url: episode_url_cleaning,
            episode_next_url: Number(episode)+1
          })
        }
      }).catch(err => {
        console.log(err)
        return ({
            status: 500,
            message: "Something went wrong!"
        })
      });

      return (request);
}
export default CDA;