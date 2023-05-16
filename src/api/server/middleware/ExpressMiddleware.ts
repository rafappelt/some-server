import { NextFunction, Request, Response } from 'express'

export default interface ExpressMiddleware {
  process(req: Request, res: Response, next: NextFunction): Promise<void>
}
