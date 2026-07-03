import { api } from "../../lib/api";
import type { Feedback } from "./feedback.types";

export async function getFeedback(): Promise<Feedback> {
   const response = await api<{ message: Feedback }>("/feedback", "GET");
   
   return response.message;
};