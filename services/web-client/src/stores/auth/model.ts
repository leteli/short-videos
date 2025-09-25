import { authDomain } from "../domains";
import { handleLogin } from "./handlers/handleLogin";
import { handleSignup } from "./handlers/handleSignup";
import { handleConfirmSignup } from "./handlers/handleConfirmSignup";
import { handleLogout } from "./handlers/handleLogout";
import {
  IAuthStore,
  ISignupRequest,
  ISignupResponse,
  IConfirmSignupRequest,
  IConfirmSignupResponse,
  ILoginRequest,
  ILoginResponse,
} from "./types";

export const signUpFx = authDomain.createEffect<
  ISignupRequest,
  ISignupResponse
>(handleSignup);

export const confirmSignupFx = authDomain.createEffect<
  IConfirmSignupRequest,
  IConfirmSignupResponse
>(handleConfirmSignup);

export const $authStore = authDomain.createStore<IAuthStore>({ user: null });

export const loginFx = authDomain.createEffect<ILoginRequest, ILoginResponse>(
  handleLogin
);
export const logoutFx = authDomain.createEffect<void, void>(handleLogout);

export const setAuth = authDomain.createEvent<IAuthStore>();
