import {keccak256} from "eth-lib/lib/hash";
import {topicToBloom} from "./bloom";

class Envelope {
  constructor(message) {
    this.expiry = message[0];
    this.ttl = message[1];
    this.topic = message[2];
    this.data = message[3];
    this.nonce = message[4];

    this.message = message;

    this.id = keccak256(message.join(""));
    this.bloom = topicToBloom(this.topic);
  }
}

export default Envelope;
