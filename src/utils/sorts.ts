import { StatusType, User } from "../models";

export function sortUserByStatusThenName(a: User, b: User) {
  const statusA = a.status?.statusType ?? StatusType.Offline;
  const statusB = b.status?.statusType ?? StatusType.Offline;

  console.log(statusA, statusB);
  if (statusA == StatusType.Offline && statusA != statusB) {
    return 1;
  }
  return a.name.localeCompare(b.name);
}