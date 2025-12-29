import { PostRequest } from "@/plugins/https";

export const ApiLogin = (data: any) => PostRequest("/auth/login", data);
