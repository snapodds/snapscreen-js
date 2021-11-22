export interface SportEventResponse {
  id: number;
  sportDataProviderCode: string;
  sportDataProviderMatchId: string;
  tvChannelId: number;
  startTime: string; //iso date-time: yyyy-MM-dd'T'HH:mm:ss.SSSZZ
  endTime: string; // iso date-time: yyyy-MM-dd'T'HH:mm:ss.SSSZZ
  sport: string;
  category: string;
  tournament: string;
  competitors: { name: string }[];
  externalId: string;
  _links: {
    self: {
      href: string;
    };
    tvChannel: {
      href: string;
    };
    tvChannelLogo: {
      href: string;
    };
  };
}
