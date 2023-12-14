import { writable } from "svelte/store";

const generateGuid = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        var r = (Math.random() * 16) | 0,
        v = c == 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
};
  

const store = () => {
  const state = {
    lastLogs: [],
  };

  const { subscribe, set, update } = writable(state);

  const methods = {
    async pushLog(message) {
      const log = {
        id: generateGuid(),
        message
      };

      update((state) => {
        state.lastLogs = [...state.lastLogs, log];
        return state;
      });

      if (
        state.lastLogs.length &&
        state.lastLogs[0].id === log.id
      ) {
        methods.startShowingLog(log);
      }
    },
    startShowingLog(log) {
        setTimeout(function () {
          methods.removeLog(log.id);
        }, 2000);
    },
    removeLog(id) {
      update((state) => {
        state.lastLogs = state.lastLogs.filter((n) => n.id !== id);
        return state;
      });
      
      if (state.lastLogs.length) {
        return methods.startShowingLog(state.lastLogs[0]);
      }
    },
  };

  return {
    subscribe,
    set,
    update,
    ...methods,
  };
};

export default store();
