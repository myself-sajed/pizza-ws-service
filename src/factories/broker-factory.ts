import config from "config";
import { KafkaBroker } from "../config/kafka";
import { MessageBroker } from "../types/broker";

let broker: MessageBroker | null = null;

export const createMessageBroker = (): MessageBroker => {
  console.log("connecting to kafka broker...");
  const brokerHost = config.get("kafka.broker")!;
  if (!broker) {
    broker = new KafkaBroker("ws-service", [brokerHost as string]);
  }
  return broker;
};
