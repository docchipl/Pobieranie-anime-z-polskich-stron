import axios, { AxiosResponse } from "axios";
import { JSDOM, VirtualConsole } from "jsdom";

//Return Interfaces
interface IPlayer {
  player: string;
  url: string;
}

const virtualConsole = new VirtualConsole();
virtualConsole.on("error", () => {
  // No-op to skip console errors.
});

export default async function ServiceNanaSubs(
  anime: string,
  episode: string | number
): Promise<{
  status: number;
  message: string;
  episode_thumbnail?: string | null;
  episodes?: IPlayer[];
  episode_next_url?: string | number;
}> {
  try {
    const response: AxiosResponse<string> = await axios.get(
      `https://nanasubs.com/anime/${anime}/odcinek-${episode}`,
      {
        headers: {
          Referer: `https://nanasubs.com/anime/${anime}/odcinek-${episode}`,
          "X-Requested-With": "XMLHttpRequest",
        },
      }
    );

    const dom = new JSDOM(response.data, { virtualConsole });
    const nanaArray = dom.window.document.querySelectorAll(
      `script[type="application/ld+json"]`
    );
    const items = dom.window.document.querySelectorAll(
      ".ns-episode-players-option"
    );
    let episodes_cleaning: IPlayer[] = [];

    if (!items || !nanaArray) {
      return {
        status: 500,
        message: "Something went wrong!",
      };
    }
    const nD = Array.from(nanaArray);

    if (!nD || nD.length <= 1 || !nD[1].textContent) {
      return {
        status: 500,
        message: "Something went wrong!",
      };
    }

    const nanaData = JSON.parse(nD[1].textContent);

    await Promise.all(
      Array.from(items).map(async function (x) {
        if (
          !x ||
          !x.getAttribute("data-player") ||
          !x.getAttribute("data-player-url")
        ) {
          return;
        }

        episodes_cleaning.push({
          player: x.getAttribute("data-player") as string,
          url: x.getAttribute("data-player-url") as string,
        });
      })
    );

    if (episodes_cleaning.length === 0) {
      return {
        status: 500,
        message: "Something went wrong!",
      };
    }

    return {
      status: 200,
      message: "Mission Accomplished!",
      episode_thumbnail: nanaData.thumbnailUrl || null,
      episodes: episodes_cleaning,
      episode_next_url: Number(episode) + 1,
    };
  } catch (error) {
    return {
      status: 500,
      message: "Something went wrong!",
    };
  }
}
