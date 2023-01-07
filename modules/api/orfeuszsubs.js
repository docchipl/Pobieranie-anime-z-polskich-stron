import axios from 'axios';

function OrfeuszSubs (id){
  const request = axios.get(`https://www.orfeusz-subs.pl/api/anime/player/episode/${id}`, {
      headers: {
        Accept: `application/json`
      }
    }).then(function (response) {
        return (response.data.player)

    }).catch(err => {
      return null;
    });

    return (request);
}
export default OrfeuszSubs;