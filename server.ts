import logger from "./src/config/logger";
import { createMessageBroker } from "./src/factories/broker-factory";
import { MessageBroker } from "./src/types/broker";
import ws from "./src/socket";
import config from "config";

const startServer = async () => {
  let broker: MessageBroker | null = null;
  const PORT = config.get("server.port");
  try {
    broker = createMessageBroker();
    await broker.connectConsumer();
    await broker.consumeMessage(["order"], false);

    ws.wsServer
      .listen(PORT, () => {
        console.log("Server listening at PORT", PORT);
      })
      .on("error", (err) => {
        console.log(err);
        logger.error("Error starting server", err);
        if (broker) {
          broker.disconnectConsumer();
        }
        process.exit(1);
      });
  } catch (err) {
    logger.error("Error happened: ", err.message);
    if (broker) {
      broker.disconnectConsumer();
    }
    process.exit(1);
  }
};

void startServer();
