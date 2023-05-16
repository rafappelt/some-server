
export default interface EndpointRequest<T extends object = Record<string, any>> {
  ip?: string;
  url: string;
  headers: Record<string, any>;
  params: Record<string, any>;
  query: Record<string, any>;
  body: T;
}
