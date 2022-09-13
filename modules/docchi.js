import axios from 'axios';

function DocchiSubs (anime, episode){
  const request = axios.get(`https://api.docchi.pl/api/episodes/find/${anime}/${episode}`, {
      headers: {
        Accept: `application/json`
      }
    }).then(function (response) {

      return ({
        status: 200, 
        message: "Success",
        episode_url: response.data,
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