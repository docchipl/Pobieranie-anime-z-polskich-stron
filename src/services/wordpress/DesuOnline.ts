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

export default async function ServiceDesuOnline(
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
      `https://desu-online.pl/${anime}-odcinek-${episode}`,
      {
        headers: {
          Referer: `https://desu-online.pl/${anime}-odcinek-${episode}`,
          "X-Requested-With": "XMLHttpRequest",
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36",
        },
      }
    );

    const dom = new JSDOM(response.data, { virtualConsole });
    const items = dom.window.document.querySelectorAll(
      ".mobius select.mirror option"
    );
    let episodes_cleaning: IPlayer[] = [];

    await Promise.all(
      Array.from(items).map(async function (x: Element) {
        const item = x as HTMLOptionElement;
        if (!item || !item.textContent || !item.value) {
          return;
        }

        if (item.textContent.toLowerCase().includes("wybierz")) return;

        const player_url = Buffer.from(item.value, "base64")
          .toString("utf8")
          .match(
            /(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/gim
          );

        if (!player_url) {
          return;
        }

        const playerURL =
          player_url && typeof player_url !== "string"
            ? player_url[0]
            : player_url;

        episodes_cleaning.push({
          player: item.textContent.toUpperCase().replaceAll("\n", "").trim(),
          url: playerURL,
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
      episode_next_url: Number(episode) + 1,
    };
  } catch (error) {
    return {
      status: 500,
      message: "Something went wrong!",
    };
  }
}
