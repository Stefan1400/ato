export const sessionTimerStyles = {
   default: {
      container: 'bg-[#1F1F1F] text-white',
      header: { styles: 'font-semibold text-md', text: 'Ready' },
      subHeader: null 
   },
   ongoing: {
      container: 'bg-[#FF9F1C] text-black',
      header: { styles: 'font-semibold text-md', text: 'Focus Session' },
      subHeader: null 
   },
   success: {
      container: 'bg-[#04724D] text-white',
      header: { styles: 'font-semibold text-md', text: 'Session Added' },
      subHeader: { styles: 'font-md text-xs', text: 'Session Saved to Analytics' } 
   },
   pending: {
      container: 'bg-[#905F1B] text-white',
      header: { styles: 'font-semibold text-md', text: 'Saving Session...' },
      subHeader: { styles: 'font-md text-xs', text: 'Adding to Analytics' } 
   },
   error: {
      container: 'bg-[#6A041D] text-white',
      header: { styles: 'font-semibold text-md', text: 'Error' },
      subHeader: { styles: 'font-md text-xs', text: 'Failed to save session. Please try again.' } 
   },
};