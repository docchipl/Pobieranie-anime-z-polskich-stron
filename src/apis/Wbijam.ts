import axios, { AxiosResponse } from "axios";
import { JSDOM, VirtualConsole } from "jsdom";

const virtualConsole = new VirtualConsole();
virtualConsole.on("error", () => {
  // No-op to skip console errors.
});

export default async function Wbijam({
  slug,
  anime,
}: {
  slug: string;
  anime: string;
}): Promise<{
  status: number;
  player?: string;
}> {
  try {
    const response: AxiosResponse<string> = await axios.get(
      `https://${anime}.wbijam.pl/odtwarzacz-${slug}.html`,
      {
        headers: {
          Referer: `https://${anime}.wbijam.pl/odtwarzacz-${slug}.html`,
          "X-Requested-With": "XMLHttpRequest",
        },
      }
    );

    const dom = new JSDOM(response.data, { virtualConsole });
    const player_url = dom.window.document.querySelector(
      "center iframe"
    ) as HTMLIFrameElement;

    if (!player_url) {
      return {
        status: 500,
      };
    }

    return {
      status: 200,
      player: player_url.src,
    };
  } catch (error) {
    return {
      status: 500,
    };
  }
}
