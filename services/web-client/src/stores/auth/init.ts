import { confirmSignupFx, loginFx, $authStore, logoutFx } from "@/stores/auth/model";

$authStore.on(confirmSignupFx.doneData, (state, payload) => {
  if (!payload) {
    return state;
  }
  return { user: payload };
});

$authStore.on(loginFx.doneData, (state, payload) => {
  if (!payload) {
    return state;
  }
  return { user: payload };
});

$authStore.on(logoutFx.done, () => ({ user: null }));
