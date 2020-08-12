import { commandManager } from "@/commands/command-manager";
import { RateLimit } from "@/utils/rate-limit";

const avatarRateLimit = new RateLimit(1, 5000);

commandManager.register({
  name: "avatar",
  description: "Changes your avatar to a random avatar",
  handle({ client, clientManager }) {
    if (!avatarRateLimit.check(client.id)) {
      client.error("Hold ya horses buddy, don't spam this command!")
      return Promise.resolve();
    }

    return client.randomAvatar();
  }
});