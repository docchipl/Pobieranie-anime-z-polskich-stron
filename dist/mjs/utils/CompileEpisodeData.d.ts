interface ResponseSource {
    code: number;
    player_embed?: string;
    hosting?: string;
    player_id?: string;
}
export default function CompilePlayerData(player: string): ResponseSource;
export {};
