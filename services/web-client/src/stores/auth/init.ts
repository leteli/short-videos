import { signUpFx, confirmSignupFx, $authStore } from "@/stores/auth/model";
import { handleSignup } from "./handlers/handleSignup";
import { handleConfirmSignup } from "./handlers/handleConfirmSignup";

signUpFx.use(handleSignup);
confirmSignupFx.use(handleConfirmSignup);

$authStore.on(confirmSignupFx.doneData, (state, payload) => {
  if (!payload) {
    return state;
  }
  return { user: payload };
});
