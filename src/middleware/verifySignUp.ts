import { ErrorHandler } from "../utils/errorHandler";
import { Clients } from "../models/client.model";
const checkisValidClient = async (req, res, next) => {
  var apiKey = req.headers["client-auth-token"];
  if (apiKey == null) {
    return next(new ErrorHandler("Lost in rabbit hole!", 403));
  }

  await Clients.findOne({
    where: {
      apiKey: apiKey,
    },
  }).then((client) => {
    if (client) {
      req.client = client;
      next();
    } else {
      return next(new ErrorHandler("Lost in rabbit hole!", 401));
    }
  });
};
export const verifySignUp = {
  checkisValidClient,
};
