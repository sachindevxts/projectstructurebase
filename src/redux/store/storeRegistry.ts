type AppStoreLike = {
  dispatch: (action: unknown) => unknown;
};

let appStore: AppStoreLike | undefined;

export const registerStore = (store: AppStoreLike) => {
  appStore = store;
};

export const getStore = () => appStore;
