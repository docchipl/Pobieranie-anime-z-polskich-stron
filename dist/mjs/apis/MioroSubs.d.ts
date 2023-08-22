export default function MioroSubsAPI(action: string, post: string, nume: string, type: string): Promise<{
    status: number;
    player?: string;
}>;
