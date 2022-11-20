import axios from 'axios';

function DocchiSubs (anime, episode){
  const request = axios.get(`https://api.docchi.pl/v1/episodes/find/${anime}/${episode}`, {
      headers: {
        Accept: `application/json`
      }
    }).then(function (response) {

      return ({
        status: 200, 
        message: "Success",
        episode_thumbnail: response.data.bg || null,
        episode_url: response.data.map(function(x) {
          return({
            player: x.player_hosting,
            url: x.player
          })
        }),
        episode_next_url: Number(episode)+1
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
export default DocchiSubs;