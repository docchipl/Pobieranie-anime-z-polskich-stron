"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function CompilePlayerData(player) {
    if (player.includes("https://") || player.includes("http://")) {
        const domain = new URL(player);
        const host = domain.hostname.replace("www.", "").toLocaleLowerCase();
        const path = domain.pathname;
        const query = domain.searchParams;
        switch (host) {
            case "ebd.cda.pl":
            case "m.cda.pl":
            case "cda.pl": {
                const splitPath = path.split("/");
                const playerID = splitPath[2];
                return {
                    code: 200,
                    player_embed: `https://ebd.cda.pl/620x368/${playerID}`,
                    hosting: "cda",
                    player_id: playerID,
                };
            }
            case "mega.nz":
            case "mega.io": {
                let playerID;
                if (!player.replaceAll("#", "!").split("/")[4]) {
                    const splitPath = player.replaceAll("#", "!").split("/");
                    playerID = splitPath[3].replaceAll("embed!!", "");
                }
                else {
                    const splitPath = player.replaceAll("#", "!").split("/");
                    playerID = splitPath[4];
                }
                return {
                    code: 200,
                    player_embed: `https://mega.nz/embed/${playerID}`,
                    hosting: "mega",
                    player_id: playerID,
                };
            }
            case "drive.google.com": {
                const splitPath = path.split("/");
                const playerID = splitPath[3];
                return {
                    code: 200,
                    player_embed: `https://drive.google.com/file/d/${playerID}/preview`,
                    hosting: "gdrive",
                    player_id: playerID,
                };
            }
            case "video.sibnet.ru": {
                const playerID = query.get("videoid");
                return {
                    code: 200,
                    player_embed: `https://video.sibnet.ru/shell.php?videoid=${playerID}`,
                    hosting: "sibnet",
                    player_id: playerID,
                };
            }
            case "dailymotion.com":
            case "www.dailymotion.com": {
                const splitPath = path.split("/");
                const playerID = splitPath.pop();
                return {
                    code: 200,
                    player_embed: `https://www.dailymotion.com/embed/video/${playerID}`,
                    hosting: "dailymotion",
                    player_id: playerID,
                };
            }
            default:
                return {
                    code: 501,
                };
        }
    }
    return {
        code: 400,
    };
}
exports.default = CompilePlayerData;
