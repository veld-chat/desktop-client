import { Module } from "vuex";
import { RootState } from "@/store";

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timeOut: number;
  visible: boolean;
}

export interface NotificationState {
  notifications: AppNotification[];
}

let notificationCounter = 0;

export const notifications: Module<NotificationState, RootState> = {
  namespaced: true,

  state: {
    notifications: []
  },

  getters: {},

  actions: {
    notify({ commit }, notification: Partial<AppNotification>) {
      if (!notification.id) {
        notification.id = "temp_" + ++notificationCounter;
      }

      if (!notification.timeOut) {
        notification.timeOut = 5000;
      }

      notification.visible = false;

      commit("addNotification", notification);

      setTimeout(() => {
        commit("setVisible", { id: notification.id, visible: true });

        setTimeout(() => {
          commit("setVisible", { id: notification.id, visible: false });

          setTimeout(() => {
            commit("removeNotification", notification.id);
          }, 500);
        }, notification.timeOut);
      }, 100);
    },
    remove({ commit }, id: string) {
      commit("removeNotification", id);
    }
  },

  mutations: {
    addNotification(state, payload: AppNotification) {
      state.notifications = [...state.notifications, payload];
    },
    removeNotification(state, id: string) {
      state.notifications = state.notifications.filter(n => n.id !== id);
    },
    setVisible(state, { id, visible }: { id: string; visible: boolean }) {
      state.notifications = state.notifications.map(n =>
        n.id === id
          ? {
            ...n,
            visible
          }
          : n
      );
    }
  }
};
