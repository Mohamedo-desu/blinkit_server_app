import fastifySession from "@fastify/session";
import ConnectMongoDBSession from "connect-mongodb-session";
import "dotenv/config";
import { Admin } from "../models/index.js";

const MongoDBStore = ConnectMongoDBSession(fastifySession);

export const sessionStore = new MongoDBStore({
  uri: process.env.MONGO_URI,
  collection: "sessions",
});

sessionStore.on("error", (error) => {
  console.log(error);
});

export const authenticate = async (email, password) => {
  try {
    if (email && password) {
      const user = await Admin.findOne({ email });
      if (!user) {
        return null;
      }

      if (user.password === password) {
        console.log(user.password);
        return Promise.resolve({ email, password });
      } else {
        return null;
      }
    }

    return null;
  } catch (error) {
    console.log(error);
  }
};

export const PORT = process.env.PORT || 3000;
export const COOKIE_PASSWORD = process.env.COOKIE_PASSWORD;
