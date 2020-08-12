import { Logger } from "tslog";

export const logger = new Logger({
  name: "chat-server",
  displayLoggerName: false,
  displayFilePath: "hidden"
});