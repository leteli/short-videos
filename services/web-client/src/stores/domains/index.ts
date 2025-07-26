import { createDomain } from "effector";
export const rootDomain = createDomain('rootDomain');
export const authDomain = rootDomain.createDomain('authDomain');
