import { User } from "@/models/user";

export interface ApiChannel {
  id: string;
  name: string;
  members?: User[];
};

export interface CreateChannelRequest {
  name: string;
}