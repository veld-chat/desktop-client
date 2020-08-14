import * as express from "express";
import swaggerUi from "swagger-ui-express";
import { Request, Response } from "express-serve-static-core";
import { ValidateError } from "tsoa";
import { AuthError } from "@/api/errors";

const swaggerDocument = require('./swagger.json');

export function RegisterSwagger(app: express.Application) {
  app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}

export function RegisterErrorHandler(app: express.Application) {
  app.use(function errorHandler(
    err: unknown,
    req: Request,
    res: Response,
    next: express.NextFunction
  ) {
    if (err instanceof ValidateError) {
      console.warn(`Caught Validation Error for ${req.path}:`, err.fields);
      return res.status(422).json({
        content: "Validation Failed",
        details: err?.fields,
      });
    }

    if (err instanceof AuthError) {
      return res.status(401).json({
        content: err.message
      });
    }

    if (err instanceof Error) {
      return res.status(500).json({
        content: "Internal Server Error",
        error: err
      });
    }

    next();
  });
}