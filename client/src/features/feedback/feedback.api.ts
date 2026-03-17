import { api } from "../../lib/api";
import type { Feedback } from "./feedback.types";

export async function getFeedback(): Promise<Feedback> {
   const response = await api<{ message: Feedback }>("/feedback", "GET");
   
   console.log(response.message);
   
   return response.message;
};