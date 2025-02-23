import app from "./app";
import globalConfig from "./config/global";

const PORT = globalConfig.app.port;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
