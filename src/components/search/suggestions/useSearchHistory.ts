
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { SearchSuggestion } from "../SearchSuggestions";

export function useSearchHistory() {
  const [searchHistory, setSearchHistory] = useLocalStorage<SearchSuggestion[]>("search_history", []);
  
  const getFilteredHistory = (searchTerm: string): SearchSuggestion[] => {
    if (!searchTerm) return searchHistory.slice(0, 5);
    
    return searchHistory
      .filter(item => item.text.toLowerCase().includes(searchTerm.toLowerCase()))
      .slice(0, 5);
  };
  
  const addToSearchHistory = (suggestion: string) => {
    // Check if the suggestion already exists
    const exists = searchHistory.some(item => item.text.toLowerCase() === suggestion.toLowerCase());
    
    if (!exists) {
      // Add new item to the beginning and limit to 10 entries
      const newHistoryItem: SearchSuggestion = {
        text: suggestion, 
        type: "history", 
        timestamp: Date.now()
      };
      
      const newHistory = [
        newHistoryItem,
        ...searchHistory.filter(item => item.text.toLowerCase() !== suggestion.toLowerCase()),
      ].slice(0, 10);
      
      setSearchHistory(newHistory);
    } else {
      // If the item exists, update its timestamp and move it to the top
      const updatedHistory: SearchSuggestion[] = [
        { text: suggestion, type: "history", timestamp: Date.now() },
        ...searchHistory.filter(item => item.text.toLowerCase() !== suggestion.toLowerCase()),
      ];
      
      setSearchHistory(updatedHistory);
    }
  };
  
  return {
    searchHistory,
    getFilteredHistory,
    addToSearchHistory
  };
}
