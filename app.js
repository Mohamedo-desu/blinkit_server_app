import "dotenv/config";
import Fastify from "fastify";
import fastifySocketIO from "fastify-socket.io";
import { PORT } from "./src/config/config.js";
import { connectDB } from "./src/config/connect.js";
import { admin, buildAdminRouter } from "./src/config/setup.js";
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

  app.listen({ port: PORT }, (err, address) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(
      `Blinkit Server listening at http://localhost:${PORT}${admin.options.rootPath}`
    );
  });
  app.ready().then(() => {
    app.io.on("connection", (socket) => {
      console.log("A user connected ✅");

      socket.on("joinRoom", (orderId) => {
        socket.join(orderId);
        console.log("❤ User joined room", orderId);
      });

      socket.on("disconnect", (orderId) => {
        socket.leave(orderId);
        console.log("A user Disconnected ❌");
      });
    });
  });
};

start();
