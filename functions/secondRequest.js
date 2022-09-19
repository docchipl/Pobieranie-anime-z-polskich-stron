import axios from 'axios';
// import fs from "fs";

async function secondRequest(request){
    const requestPage = axios.get(`https://${request.anime}.wbijam.pl/odtwarzacz-${request.slug}.html`, {
            headers: {
                Referer: `https://${request.anime}.wbijam.pl/odtwarzacz-${request.slug}.html`,
                'X-Requested-With': 'XMLHttpRequest'
            }
    }).then(function (response) {

        // fs.writeFile('helloworld.html', response.data, function (err) {
        //     if (err) return console.log(err);
        //     console.log('Hello World > helloworld.txt');
        //   });
        return ({
            status: 200,
            message: "Success",
            data: response.data
        })

    }).catch(err => {
        console.log(err)
        return ({
            status: 500,
            message: "Something went wrong!"
        })
    });


    return (requestPage);
}

export default secondRequest;