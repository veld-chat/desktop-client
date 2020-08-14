/* eslint-disable @typescript-eslint/no-explicit-any */
import Vue from "vue";

export function getId(obj: string | { id: string }): string {
  return typeof obj !== "string" ? obj.id : obj;
}

export function crudActions() {
  return {
    replaceAll({ commit }, entities: any) {
      commit("replaceAll", entities);
    },
    set({ commit }, entityOrId: any) {
      commit("set", entityOrId);
    },
    remove({ commit }, entityOrId: any) {
      commit("remove", entityOrId);
    },
  }
}

export function crudMutations(objName: string, keysName: string) {
  return {
    replaceAll(state, payload: {[id: string]: any}) {
      state[objName] = payload;
      state[keysName] = Object.keys(payload);
    },
    set(state, payload: any) {
      const id = getId(payload);

      Vue.set(state[objName], id, payload);

      if (!state[keysName].includes(id)) {
        state[keysName].push(id);
      }
    },
    remove(state, payload: any) {
      const id = getId(payload);
      const keyIndex = state[keysName].indexOf(id)

      Vue.delete(state[objName], id);

      if (keyIndex !== -1) {
        Vue.delete(state[keysName], keyIndex);
      }
    },
  }
}
