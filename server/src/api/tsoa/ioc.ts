import { container } from "tsyringe";

export const iocContainer = {
  get<T>(func: any) {
    return container.resolve<T>(func);
  }
};