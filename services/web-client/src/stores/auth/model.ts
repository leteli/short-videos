import { authDomain } from "../domains";
import {
  IAuthStore,
  ISignupRequest,
  ISignupResponse,
  IConfirmSignupRequest,
  IConfirmSignupResponse,
} from "./types";

export const signUpFx = authDomain.createEffect<
  ISignupRequest,
  ISignupResponse
>("signUpFx");
export const confirmSignupFx = authDomain.createEffect<
  IConfirmSignupRequest,
  IConfirmSignupResponse
>("signUpFx");

export const $authStore = authDomain.createStore<IAuthStore>({ user: null });
