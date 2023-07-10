import axios from "axios";

export default async function Wbijam(request) {
  const requestPage = axios
    .get(`https://${request.anime}.wbijam.pl/odtwarzacz-${request.slug}.html`, {
      headers: {
        Referer: `https://${request.anime}.wbijam.pl/odtwarzacz-${request.slug}.html`,
        "X-Requested-With": "XMLHttpRequest",
      },
    })
    .then(function (response) {
      return {
        status: 200,
        message: "Success",
        data: response.data,
      };
    })
    .catch((err) => {
      //console.log(err)
      return {
        status: 500,
        message: "Something went wrong!",
      };
    });

  return requestPage;
}
