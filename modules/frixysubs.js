import axios from 'axios';

function FrixySubs (anime, episode){
  const request = axios.get(`https://frixysubs.pl/api/anime/${anime}/${episode}`, {
      headers: {
        Referer: `https://frixysubs.pl/anime/${anime}/${episode}`,
        'X-Requested-With': 'XMLHttpRequest'
      }
    }).then(function (response) {
      return ({
        status: 200, 
        message: "Success",
        episode_url: response.data.episode.players.map(function(x) {
          return({
            player: x.name,
            url: x.link
          })
        }),
        episode_next_url: `/anime/${anime}/${Number(episode)+1}`
      })
    }).catch(err => {
      console.log(err)
      return ({
          status: 500,
          message: "Something went wrong!"
      })
    });

    return (request);
}
export default FrixySubs;