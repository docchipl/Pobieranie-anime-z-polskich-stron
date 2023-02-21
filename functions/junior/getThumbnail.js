import axios from 'axios';
import jsdom from 'jsdom';

const { JSDOM } = jsdom;
const virtualConsole = new jsdom.VirtualConsole();
virtualConsole.on("error", () => {
  // No-op to skip console errors.
});

async function secondRequest(request){
    const requestPage = axios.get(`https://juniorsubs.pl/${request.category}/${request.anime}`, {
            headers: {
                Referer: `https://juniorsubs.pl/${request.category}/${request.anime}`,
                'X-Requested-With': 'XMLHttpRequest'
            }
    }).then(async function (response) {
        const dom = new JSDOM(response.data, { virtualConsole });
        const items = dom.window.document.querySelectorAll(".elementor-container .elementor-column.elementor-element .elementor-widget-container .elementor-heading-title ");
        const thumbnails = dom.window.document.querySelectorAll('.elementor-container .elementor-column.elementor-element .elementor-widget-wrap .elementor-widget-image .elementor-widget-container');
        let thumbnail = null;

        await Promise.all(
            Array.from(items).map(async function(x, index) {
                const title = x.textContent.toLowerCase();
                if(title.includes("odcinek")){
                    if(request.episode === Number(title.replaceAll("odcinek", "")) ){
                        thumbnail = thumbnails[index-1].querySelector("img").src || null;
                    }
                }
                return;
            })
        )
        return ({
            status: 200,
            message: "Success",
            thumbnail: thumbnail
        })

    }).catch(err => {
        //console.log(err)
        return ({
            status: 500,
            message: "error",
            thumbnail: null
        })
    });


    return (requestPage);
}

export default secondRequest;