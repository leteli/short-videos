import { createDomain } from "effector";
export const rootDomain = createDomain('rootDomain');
export const authDomain = rootDomain.createDomain('authDomain');
export const chatsDomain = rootDomain.createDomain('chatsDomain');
export const usersDomain = rootDomain.createDomain('usersDomain');
