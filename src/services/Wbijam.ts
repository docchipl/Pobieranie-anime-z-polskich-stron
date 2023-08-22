import axios, { AxiosResponse } from "axios";
import { JSDOM, VirtualConsole } from "jsdom";
import { WbijamAPI } from "../apis";

//Return Interfaces
interface IPlayer {
  player: string;
  url: string;
}

const virtualConsole = new VirtualConsole();
virtualConsole.on("error", () => {
  // No-op to skip console errors.
});

export default async function ServiceWbijam(
  anime: string,
  episode: string | number
): Promise<{
  status: number;
  message: string;
  episode_thumbnail?: string | null;
  episodes?: IPlayer[];
  episode_next_url?: string | number | null;
}> {
  try {
    const response: AxiosResponse<string> = await axios.get(
      `https://${anime}.wbijam.pl/${episode}.html`,
      {
        headers: {
          Referer: `https://${anime}.wbijam.pl/${episode}.html`,
          "X-Requested-With": "XMLHttpRequest",
        },
      }
    );

    const dom = new JSDOM(response.data, { virtualConsole });
    const items = dom.window.document.querySelectorAll("tr.lista_hover");
    const nextEpisodeButton = dom.window.document.querySelector(
      ".nawigacja_prawa a"
    ) as HTMLAnchorElement;
    const episode_next_url = nextEpisodeButton ? nextEpisodeButton.href : null;
    const tURL = dom.window.document.querySelector(
      `a[rel="galeria"]`
    ) as HTMLAnchorElement;
    const thumbnail = tURL ? `https://${anime}.wbijam.pl/${tURL.href}` : null;

    let episodes_cleaning: IPlayer[] = [];

    if (!items) {
      return {
        status: 500,
        message: "Something went wrong!",
      };
    }

    const iArray = Array.from(items);

    if (
      iArray.length === 0 &&
      !dom.window.document.querySelector(".pod_naglowek")
    )
      return {
        status: 500,
        message: "Something went wrong!",
      };
    if (
      iArray.length === 0 &&
      dom.window.document.querySelector(".pod_naglowek")
    )
      return {
        status: 204,
        message: "Page loads but doesn't have any players.",
      };

    const iArrayElement = iArray[0];
    const iArrayURL = iArrayElement.textContent;
    if (
      iArray.length === 1 &&
      iArrayElement &&
      iArrayURL &&
      iArrayURL.includes("zwiastun")
    )
      return {
        status: 500,
        message: "Something went wrong!",
      };

    await Promise.all(
      Array.from(items).map(async function (x: Element) {
        if (!x) return;

        const pURL = x.querySelector(".odtwarzacz_link");
        const pNAMES = x.querySelectorAll("td.center");

        if (!pURL || !pNAMES || pNAMES.length <= 1 || !pNAMES[2].textContent)
          return;

        const player_info = {
          anime: anime,
          slug: pURL.getAttribute("rel") as string,
          player_name: pNAMES[2].textContent as string,
        };

        if (player_info.player_name.toLowerCase() === "vk") return;

        const requestPlayer = await WbijamAPI(player_info);

        if (!requestPlayer || !requestPlayer.player) return;

        episodes_cleaning.push({
          player: player_info.player_name,
          url: requestPlayer.player,
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
      episode_thumbnail: thumbnail,
      episodes: episodes_cleaning,
      episode_next_url: episode_next_url,
    };
  } catch (error) {
    return {
      status: 500,
      message: "Something went wrong!",
    };
  }
}
