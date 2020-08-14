import { ApiUser } from "@/models";

export interface ApiChannel {
  id: string;
  system: boolean;
  name: string;
  members?: ApiUser[];
}