import { User } from "@/models/user";

export interface APIChannel {
  id: string;
  name: string;
  members?: User[];
};

export interface CreateChannelRequest {
  name: string;
}