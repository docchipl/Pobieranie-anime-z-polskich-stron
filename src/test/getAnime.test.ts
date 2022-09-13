import scopeAnime from '..';
import { AvailableSubs } from '../enums';

describe('Getting anime from subs', () => {
  test('should return anime from OkamiSubs', async () => {
    const data = await scopeAnime({
      anime: 'baraou-no-souretsu',
      episode: '2-1007c078-b20b-4c62-888a-e5b20a2e720b',
      website: AvailableSubs.OkamiSubs,
    });
    expect(data.status).toBe(200);
  });

  test('should return anime from MioroSubs', async () => {
    const data = await scopeAnime({
      anime: 'summertime-render-odcinek',
      episode: '12',
      website: AvailableSubs.MioroSubs,
    });
    expect(data.status).toBe(200);
  });

  test('should return anime from DayidSub', async () => {
    const data = await scopeAnime({
      anime: 'Tensei-Kenja-no-Isekai-Life',
      episode: '01',
      website: AvailableSubs.DayidSub,
    });
    expect(data.status).toBe(200);
  });

  test('should return anime from NanaSubs', async () => {
    const data = await scopeAnime({
      anime: 'engage-kiss',
      episode: '855',
      website: AvailableSubs.NanaSubs,
    });
    expect(data.status).toBe(200);
  });

  test('should return anime from FumetsuSubs', async () => {
    const data = await scopeAnime({
      anime: 'AzurLane',
      episode: '0',
      website: AvailableSubs.FumetsuSubs,
    });
    expect(data.status).toBe(200);
  });
});
