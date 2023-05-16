import { NextFunction, Request, Response } from 'express'
import { OAuth2Client } from 'google-auth-library'
import ExpressMiddleware from './ExpressMiddleware'

export default class GoogleAuthChecker implements ExpressMiddleware {
  client: OAuth2Client

  constructor(
    protected oAuth: 'enabled' | 'disabled' | 'header',
    protected clientId: string,
    protected clientSecret?: string
  ) {
    this.client = new OAuth2Client(clientId, clientSecret)
  }

  async process(req: Request, res: Response, next: NextFunction) {
    if (req.method === 'OPTIONS') {
      next()
      return
    }

    console.debug(req.headers)

    try {
      if (!this.isOauthEnabled(req)) {
        next()
        return
      }

      const idToken = this.extractJWTToken(req)
      const ticket = await this.checkToken(idToken)
      console.log(`${ticket.getPayload()?.name} logged in`)
      next()
    } catch (error: unknown) {
      this.handleError(error, res)
    }
  }

  protected handleError(error: unknown, res: Response) {
    if (error instanceof Error) {
      res.status(401).send({ error: error.message })
      return
    }
    res.status(500).send({ error: 'Unknown error' })
  }

  protected isOauthEnabled(req: Request) {
    if (this.oAuth === 'enabled') {
      console.log('OAuth enabled.')
      return true
    }

    if (this.oAuth === 'disabled') {
      console.warn('WARNING: OAuth disabled.')
      return false
    }

    const oauthEnabled = req.headers.oauth_enabled
    console.log(`OAuth ${oauthEnabled ? 'enabled' : 'disabled'} via request header.`)
    return oauthEnabled === 'true'
  }

  protected async checkToken(idToken?: string) {
    if (!idToken) {
      throw Error('Missing authorization token')
    }

    const audience = this.clientId
    const ticket = await this.client.verifyIdToken({
      idToken,
      audience
    })

    return ticket
  }

  protected extractJWTToken(req: Request) {
    const auth = req.headers.authorization
    if (!auth) {
      return undefined
    }

    if (typeof auth === 'string') {
      return auth
    }

    return auth[0]
  }
}
