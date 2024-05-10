import axios from "axios";
import { songs } from "./songs";
import { users } from "./users";
import { threads } from "./threads";

export const api = axios.create({
  baseURL: "",
});

export const services = { songs, users, threads };
