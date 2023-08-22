export default function Wbijam({ slug, anime, }: {
    slug: string;
    anime: string;
}): Promise<{
    status: number;
    player?: string;
}>;
