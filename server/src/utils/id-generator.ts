import { Snowyflake } from "snowyflake";

const snowyflake = new Snowyflake();

export function generateId() {
  return snowyflake.nextId().toString();
}