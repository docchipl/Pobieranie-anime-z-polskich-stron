import axios from 'axios';

export default function MaouSubs (anime, episode){
  const request = axios.get(`https://api.docchi.pl/v1/partner/maousubs/find/${anime}/${episode}`, {
      headers: {
        Accept: `application/json`
      }
    }).then(function (response) {
      return ({
        status: 200, 
        message: "Success",
        episode_thumbnail: response.data.Image || null,
        episode_url: response.data.players,
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