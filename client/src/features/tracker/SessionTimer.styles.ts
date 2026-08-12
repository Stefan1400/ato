import { CircleCheck, CircleX, Loader2 } from "lucide-react";
import type { StateStyles, UIStates } from "./tracker.types";

export const sessionTimerStyles: Record<UIStates, StateStyles> = {
   default: {
      container: 'bg-[#1F1F1F] text-white',
      header: { styles: 'font-semibold text-md', text: 'Study Timer' },
      subHeader: { styles: 'font-md text-xs', text: "Start your session" },
      btnVisible: true
   },
   ongoing: {
      container: 'bg-[#FF9F1C] text-black',
      header: { styles: 'font-semibold text-md', text: 'Focus Session' },
      subHeader: { styles: 'font-md text-xs', text: "Stay Focused" },
      btnVisible: true
   },
   success: {
      container: 'bg-[#04724D] text-white',
      header: { styles: 'font-semibold text-md', text: 'Session Added', icon: CircleCheck },
      subHeader: { styles: 'font-md text-xs', text: 'Session Saved to Analytics' },
      btnVisible: false
   },
   pending: {
      container: 'bg-[#905F1B] text-white',
      header: { styles: 'font-semibold text-md', text: 'Saving Session...' },
      subHeader: { styles: 'font-md text-xs', text: 'Adding to Analytics', icon: Loader2 },
      btnVisible: false
   },
   error: {
      container: 'bg-[#6A041D] text-white',
      header: { styles: 'font-semibold text-md', text: 'Error', icon: CircleX },
      subHeader: { styles: 'font-md text-xs', text: 'Failed to save session. Please try again.' },
      btnVisible: false
   },
};