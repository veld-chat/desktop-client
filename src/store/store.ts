import Vue from "vue";
import Vuex from "vuex";
import * as modules from "./modules";
import { RootState } from "../store";

Vue.use(Vuex);

export const store = new Vuex.Store<RootState>({
  state: {},
  modules: modules
});
