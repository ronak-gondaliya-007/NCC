import { NextFunction, Request, Response } from 'express';

type AsyncHandlerFunction = (req: Request, res: Response, next: NextFunction) => Promise<any>;

const asyncHandler = (fn: AsyncHandlerFunction) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch((error) => {
    if (error.code === 11000) {
      return res.status(400).send({
        message: `${Object.keys(error.keyValue)[0]} is already in use.`,
        error: true,
        err: error.keyValue,
      });
    } else {
      return res.status(500).send({
        message: 'Internal Server Error',
        error,
      });
    }
  });
};

export default asyncHandler;
