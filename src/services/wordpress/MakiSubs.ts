import { MakiSubsAPI } from "../../apis/index";
import axios, { AxiosResponse } from "axios";
import { JSDOM, VirtualConsole } from "jsdom";

//Return Interfaces
interface IPlayer {
  player: string;
  url: string;
}

const tNFun = (tn:Element):string => {
  const imgElement = tn as HTMLAnchorElement;
  return imgElement.href;
}

const virtualConsole = new VirtualConsole();
virtualConsole.on("error", () => {
  // No-op to skip console errors.
});

export default async function ServiceMakiSubs(
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
      `https://makisubs.online/episodes/${anime}x${episode}`,
      {
        headers: {
          Referer: `https://makisubs.online/episodes/${anime}x${episode}`,
          "X-Requested-With": "XMLHttpRequest",
        },
      }
    );

    const dom = new JSDOM(response.data, { virtualConsole });
    const thumbnail = dom.window.document.querySelector(".g-item a");
    const pO = dom.window.document.querySelector("#playeroptionsul");
    let episodes_cleaning: IPlayer[] = [];

    if (!pO) {
      return {
        status: 500,
        message: "Something went wrong!",
      };
    }

    const items = pO.querySelectorAll("li.dooplay_player_option");

    await Promise.all(
      Array.from(items).map(async function (x) {
        const pT = x.querySelector(".title");

        if (!pT || !pT.textContent) return;

        const data: Element = x;

        if (
          !data ||
          !data.getAttribute("data-post") ||
          !data.getAttribute("data-nume") ||
          !data.getAttribute("data-type")
        ) {
          return {
            status: 500,
            message: "Something went wrong!",
          };
        }

        const playerInfo: {
          status: number;
          player?: string;
        } = await MakiSubsAPI(
          "doo_player_ajax",
          x.getAttribute("data-post") as string,
          x.getAttribute("data-nume") as string,
          x.getAttribute("data-type") as string
        );

        if (playerInfo.status !== 200 || !playerInfo.player) {
          return;
        }

        episodes_cleaning.push({
          player: pT.textContent,
          url: playerInfo.player,
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
      episode_thumbnail: thumbnail ? tNFun(thumbnail) : null,
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
