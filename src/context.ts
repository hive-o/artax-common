export interface ArtaxContext {
  navigations: Record<
    string,
    { params: { key: string; value: string }[]; uri: string }
  >;
  uri: string;
}
