export default function MakiSubsAPI(action: string, post: string, nume: string, type: string): Promise<{
    status: number;
    player?: string;
}>;
