import { Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { AuthRequest } from "../../types/express";

export const onlyManager = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  if (req.user?.role === "manager" || req.user?.role === "admin") {
    next();
  } else {
    res.status(StatusCodes.FORBIDDEN).json({ message: "Access denied" });
  }
};

export const onlyAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  // console.log(req)
  if (req.user?.role === "admin") {
    next();
  } else {
    res.status(StatusCodes.FORBIDDEN).json({ message: "Access denied" });
  }
};
