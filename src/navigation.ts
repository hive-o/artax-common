interface RouteEntry {
  path: string;
  searchParams: URLSearchParams;
}

interface DomainEntry {
  domain: string;
  protocol: string;
  routes: Map<string, RouteEntry>; // Use a Map for route entries
}

export class Navigation {
  private static _instance: Navigation;
  private readonly registry: Map<string, DomainEntry> = new Map();

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  public static instance(): Navigation {
    if (!Navigation._instance) {
      Navigation._instance = new Navigation();
    }

    return Navigation._instance;
  }

  public entries() {
    const list: { searchParams: URLSearchParams; uri: URL }[] = [];

    this.registry.forEach(({ domain, protocol, routes }) => {
      const site = `${protocol}//${domain}`;

      routes.forEach(({ path, searchParams }) => {
        const uri = new URL(site + path);
        list.push({ searchParams, uri });
      });
    });

    return list;
  }

  public forEach(
    cb: (value: DomainEntry, key: string, map: Map<string, DomainEntry>) => void
  ) {
    this.registry.forEach(cb);
  }

  public get(uri: URL): DomainEntry | undefined {
    return this.registry.get(uri.hostname);
  }

  public has(uri: URL): boolean {
    const domain = uri.hostname;
    const path = uri.pathname;

    return this.registry.get(domain)?.routes.has(path) ?? false;
  }

  public routes(uri: URL) {
    return this.get(uri)?.routes;
  }

  public set(uri: URL): DomainEntry {
    const domain = uri.hostname;
    const path = uri.pathname;

    let domainEntry = this.registry.get(domain);
    if (!domainEntry) {
      domainEntry = { domain, protocol: uri.protocol, routes: new Map() };
      this.registry.set(domain, domainEntry);
    }

    let route_entry = domainEntry.routes.get(path);
    if (!route_entry) {
      route_entry = { path, searchParams: uri.searchParams };
      domainEntry.routes.set(path, route_entry);
    } else {
      uri.searchParams.forEach((value, key) => {
        route_entry?.searchParams.set(key, value);
      });
    }

    return domainEntry;
  }
}
