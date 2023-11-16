import { describe, expect, test } from "@jest/globals";
import { ServiceFumetsu, ServiceNanaSubs } from "../services/index";

describe("Custom Services", () => {

  test("Fumetsu", async () => {
    expect(await ServiceFumetsu("GoblinSlayer2ndSeason", "3")).toStrictEqual({
      status: 200,
      episode_thumbnail: null,
      message: "Mission Accomplished!",
      episodes: [
        { player: "cda", url: "https://ebd.cda.pl/620x368/1680350744" },
        {
          player: "mega",
          url: "https://mega.nz/embed/RU8jlCoA!SWJ8JoLcUv0DFY2qbc-HpvIBmLuokRn6sSX7crL5t0c",
        }
      ],
      episode_next_url: 4,
    });
  });

  test("Nana Subs", async () => {
    expect(await ServiceNanaSubs("one-piece", "1081")).toStrictEqual({
      status: 200,
      episode_thumbnail: "https://nanasubs.com/images/episodes/one-piece-1081.webp",
      message: "Mission Accomplished!",
      episodes: [
        { player: "cda", url: "https://ebd.cda.pl/620x395/1683612246" },
        {
          player: "gdrive",
          url: "https://drive.google.com/file/d/1dYpb4uFRyBQGehiR7Q-Av0mXcYS-ghXz/preview",
        }
      ],
      episode_next_url: 1082,
    });
  });
});
