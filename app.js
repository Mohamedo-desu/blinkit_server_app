import "dotenv/config";
import Fastify from "fastify";
import { PORT } from "./src/config/config.js";
import { connectDB } from "./src/config/connect.js";
import { admin, buildAdminRouter } from "./src/config/setup.js";
import { registerRoutes } from "./src/routes/index.js";

const start = async () => {
  const MONGO_URI = process.env.MONGO_URI;
  await connectDB(MONGO_URI);
  const app = Fastify();

  await registerRoutes(app);

  await buildAdminRouter(app);

  app.listen({ port: PORT, host: "0.0.0.0" }, (err, address) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(
      `Blinkit Server listening at http://localhost:${PORT}${admin.options.rootPath}`
    );
  });
};

start();
