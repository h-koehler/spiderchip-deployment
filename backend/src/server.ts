import app from "./app";
import { getPrisma } from "./config/db";
import globalConfig from "./config/global";

const PORT = globalConfig.app.port;

const startServer = async () => {
  try {
    const prisma = await getPrisma();
    await prisma.$connect();
    console.log("✅ Database connected successfully");

    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

    const shutdown = async (signal: string) => {
      console.log(`🛑 Received ${signal}. Shutting down gracefully...`);
      await prisma.$disconnect();
      console.log("✅ Database disconnected");
      server.close(() => {
        console.log("🚀 Server shut down successfully");
        process.exit(0);
      });
    };

    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    process.exit(1);
  }
};

startServer();