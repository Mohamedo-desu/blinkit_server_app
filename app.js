import "dotenv/config";
import Fastify from "fastify";
import fastifySocketIO from "fastify-socket.io";
import { PORT } from "./src/config/config.js";
import { connectDB } from "./src/config/connect.js";
import { admin, buildAdminRouter } from "./src/config/setup.js";
import keepAwake from "./src/cronJobs/keepAwake.js";
import { registerRoutes } from "./src/routes/index.js";

const start = async () => {
  const MONGO_URI = process.env.MONGO_URI;
  await connectDB(MONGO_URI);
  const app = Fastify();

  app.register(fastifySocketIO, {
    cors: {
      origin: "*",
    },
    pingInterval: 10000,
    pingTimeout: 5000,
    transports: ["websocket"],
  });

  await registerRoutes(app);
  await buildAdminRouter(app);

  app.get("/ping", async (_, reply) => {
    return reply.send("pong");
  });

  app.listen({ port: PORT, host: "0.0.0.0" }, (err) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }

    const serverAddress =
      process.env.NODE_ENV === "production"
        ? process.env.HOST
        : `http://localhost:${PORT}`;

    console.log(
      `Blinkit Server listening at ${serverAddress}${admin.options.rootPath}`
    );
  });

  app.ready().then(() => {
    if (process.env.NODE_ENV === "production") {
      keepAwake.start();
    }

    // Handle WebSocket connections
    app.io.on("connection", (socket) => {
      console.log("A user connected ✅");

      socket.on("joinRoom", (orderId) => {
        socket.join(orderId);
        console.log("❤ User joined room", orderId);
      });

      socket.on("disconnect", () => {
        console.log("A user Disconnected ❌");
      });
    });
  });
};

start();
