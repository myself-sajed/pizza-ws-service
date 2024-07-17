import { Consumer, EachMessagePayload, Kafka } from "kafkajs";
import { MessageBroker } from "../types/broker";
import ws from "../socket";

export class KafkaBroker implements MessageBroker {
  private consumer: Consumer;

  constructor(clientId: string, brokers: string[]) {
    const kafka = new Kafka({ clientId, brokers });

    this.consumer = kafka.consumer({ groupId: clientId });
  }

  /**
   * Connect the consumer
   */
  async connectConsumer() {
    await this.consumer.connect();
  }

  /**
   * Disconnect the consumer
   */
  async disconnectConsumer() {
    await this.consumer.disconnect();
  }

  async consumeMessage(topics: string[], fromBeginning: boolean = false) {
    await this.consumer.subscribe({ topics, fromBeginning });

    await this.consumer.run({
      eachMessage: async ({
        topic,
        partition,
        message,
      }: EachMessagePayload) => {
        // Logic to handle incoming messages.
        console.log({
          value: message.value.toString(),
          topic,
          partition,
        });

        switch (topic) {
          case "order":
            {
              const order = JSON.parse(message.value.toString());
              console.log("order received:", order);
              const tenantId = order.data.tenantId;
              console.log("tenantId:", tenantId);
              ws.io.to(`Tenant-${tenantId}`).emit("new-order", order);
            }
            break;

          default:
            console.log("Topic listened:", topic);
        }
      },
    });
  }
}
