import { Request } from 'express'
/**
 * Express Framework Helper functions
 */
export default class ExpressServerHelper {
  /**
   * Return the IP of the client who made the request.
   * At first look for the ip provided by the proxy then for the socket ip.
   * @param request The client's request provided by the Express Framework
   * @returns the client's ip
   */
  public static extractClientIP(request: Request): string | undefined {
    return this.extractClientIPFromProxy(request) || this.extractClientIPFromSocket(request)
  }

  /**
   * Return the IP of the client who made the request.
   * At first look for the ip provided by the proxy then for the socket ip.
   * @param request The client's request provided by the Express Framework
   * @returns the client's ip
   */
  public static extractClientIPFromProxy(request: Request): string | undefined {
    let xForwardedFor = request.headers['x-forwarded-for']

    if (!xForwardedFor) {
      return undefined
    }

    // Discard duplicated values
    if (Array.isArray(xForwardedFor)) {
      xForwardedFor = xForwardedFor[0]
    }

    // If the value is a comma+space separated list of IP addresses, the left-most is the original client.
    return xForwardedFor.split(',')[0]
  }

  /**
   * Return the client IP connected over the socket
   * @param request The client's request provided by the Express Framework
   * @returns The client's IP
   */
  public static extractClientIPFromSocket(request: Request): string | undefined {
    const ip = request.socket.remoteAddress

    if (!ip) {
      return undefined
    }

    return ip.split(':').pop()
  }
}
