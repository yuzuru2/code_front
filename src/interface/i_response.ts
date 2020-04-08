export interface i_responce {
  search: {
    title: string;
    genreId: number;
    source: string;
  };
  create: {
    q: string;
  };
}
