import { Navigation } from './navigation';

export interface ArtaxContext {
  depth: number;
  navigation: Navigation;
  payloads: string[];
  selectors: string[];
  uri: string;
}
