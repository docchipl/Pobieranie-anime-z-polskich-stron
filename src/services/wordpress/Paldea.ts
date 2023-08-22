import axios, { AxiosResponse } from "axios";
import { JSDOM, VirtualConsole } from "jsdom";
import CompilePlayerData from "../../utils/CompileEpisodeData";

//Return Interfaces
interface IPlayer {
  player: string;
  url: string;
}

const virtualConsole = new VirtualConsole();
virtualConsole.on("error", () => {
  // No-op to skip console errors.
});

export default async function ServicePaldea(episode: string | number): Promise<{
  status: number;
  message: string;
  episode_thumbnail?: string | null;
  episodes?: IPlayer[];
  episode_next_url?: string | number | null;
}> {
  try {
    const response: AxiosResponse<string> = await axios.get(
      `https://paldea.pl/odcinek/${episode}`,
      {
        headers: {
          Referer: `https://paldea.pl/odcinek/${episode}`,
          "X-Requested-With": "XMLHttpRequest",
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36",
        },
      }
    );

    const dom = new JSDOM(response.data, { virtualConsole });
    const vC = dom.window.document.querySelectorAll(".video-container");
    const urls = dom.window.document.querySelectorAll(
      ".post-content .fusion-layout-column .fusion-column-wrapper a.fusion-button"
    );
    let episodes_cleaning: IPlayer[] = [];
    let episode_next_url: string | null = null;

    await Promise.all(
      Array.from(urls).map(async function (x: Element) {
        const item = x as HTMLAnchorElement;
        const urlArray = item.href.split("/");

        if (!urlArray.includes("odcinek")) {
          return;
        }

        const episodeNumber =
          urlArray.length >= 6 ? urlArray[4] : urlArray.pop();

        if (!episodeNumber || episodeNumber === episode) {
          return;
        }

        episode_next_url = episodeNumber ?? null;
      })
    );

    await Promise.all(
      Array.from(vC).map(async function (x) {
        if (!x) return;

        const player = x.querySelector("iframe") as HTMLIFrameElement;
        const data = CompilePlayerData(player.src);

        if (!data || !data.player_embed || !data.hosting) {
          return;
        }

        episodes_cleaning.push({
          player: data.hosting,
          url: data.player_embed,
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
      episode_thumbnail: null,
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
