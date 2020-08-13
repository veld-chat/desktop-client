import { User } from "@/models/user";

export type APIChannel = {
  id: string;
  name: string;
  members?: User[];
};

export type CreateChannelRequest = {
  name: string;
}