"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Configure,
  SearchBox,
  useInstantSearch,
  useSearchBox,
  useHits,
} from "react-instantsearch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, X, Command, Mic, MicOff } from "lucide-react";
import Hit from "../Hits";
import CustomPagination from "./CustomPagination";
import { cn } from "@/lib/utils";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

// Define the product type to match what's expected by Hit component
type AlgoliaProduct = {
  name: string;
  description: string;
  price: number;
  discount: number;
  sku: string;
  tags: string[];
  category: string;
  brand: string;
  variants: {
    color: string;
    price: number;
    salePrice: number;
    stockQuantity: number;
    sizes: {
      size: string;
      stockQuantity: number;
      sku: string;
    }[];
    colorOptionImages: string[];
  }[];
  type: string;
  gender: string;
  material: string;
  releaseDate: string;
  rating: number;
  objectID: string;
};

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
}

const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  initialQuery = "",
}) => {
  const { results, status } = useInstantSearch();
  const { query, refine } = useSearchBox();
  const { items: hits } = useHits<AlgoliaProduct>();
  const [localQuery, setLocalQuery] = useState(initialQuery);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  
  // Speech recognition states
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Check for speech recognition support
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      setSpeechSupported(!!SpeechRecognition);
      
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-US';
        
        recognition.onstart = () => {
          setIsListening(true);
        };
        
        recognition.onresult = (event) => {
          const transcript = Array.from(event.results)
            .map(result => result[0])
            .map(result => result.transcript)
            .join('');
          
          if (event.results[0].isFinal) {
            handleInputChange(transcript);
            setIsListening(false);
          } else {
            // Update input with interim results
            setLocalQuery(transcript);
          }
        };
        
        recognition.onerror = (event) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
        };
        
        recognition.onend = () => {
          setIsListening(false);
        };
        
        recognitionRef.current = recognition;
      }
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  // Speech recognition functions
  const startListening = useCallback(() => {
    if (recognitionRef.current && speechSupported) {
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error('Error starting speech recognition:', error);
      }
    }
  }, [speechSupported]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, []);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  // Debounced search function for better performance
  const debouncedRefine = useCallback(
    (value: string) => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      debounceRef.current = setTimeout(() => {
        refine(value);
      }, 300); // 300ms delay
    },
    [refine]
  );

  // Handle input change with debouncing
  const handleInputChange = useCallback(
    (value: string) => {
      setLocalQuery(value);
      setSelectedIndex(-1); // Reset selection when typing
      debouncedRefine(value);
    },
    [debouncedRefine]
  );

  // Set initial query when modal opens
  useEffect(() => {
    if (isOpen && initialQuery && initialQuery !== query) {
      setLocalQuery(initialQuery);
      refine(initialQuery);
    }
  }, [isOpen, initialQuery, query, refine]);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Clear search when modal closes
  const handleClose = useCallback(() => {
    setLocalQuery("");
    setSelectedIndex(-1);
    refine("");
    stopListening(); // Stop listening when modal closes
    onClose();
  }, [refine, onClose, stopListening]);

  // Handle keyboard shortcuts and navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case "Escape":
          handleClose();
          break;
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex(prev => 
            prev < (hits?.length || 0) - 1 ? prev + 1 : prev
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex(prev => prev > -1 ? prev - 1 : -1);
          break;
        case "Enter":
          e.preventDefault();
          if (selectedIndex >= 0 && hits?.[selectedIndex]) {
            // Navigate to product page
            window.location.href = `/products/${hits[selectedIndex].sku}`;
          }
          break;
        // Add spacebar to toggle voice search
        case " ":
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            toggleListening();
          }
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleClose, hits, selectedIndex, toggleListening]);

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="fixed top-[10%] left-[50%] translate-x-[-50%] translate-y-0 w-full max-w-3xl max-h-[80vh] overflow-hidden bg-white dark:bg-zinc-900 border shadow-2xl p-0">
        <VisuallyHidden>
          <DialogTitle>Search Products</DialogTitle>
        </VisuallyHidden>
        
        {/* Header with Search Input */}
        <DialogHeader className="border-b pb-4 px-6 pt-6">
          <div className="flex items-center space-x-3">
            <Search className="h-5 w-5 text-zinc-400 flex-shrink-0" />
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                placeholder={isListening ? "Listening..." : "Search products..."}
                value={localQuery}
                onChange={(e) => handleInputChange(e.target.value)}
                className={cn(
                  "w-full px-0 py-2 bg-transparent border-none outline-none text-lg placeholder:text-zinc-400 focus:ring-0 text-zinc-900 dark:text-zinc-100",
                  isListening && "animate-pulse"
                )}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
                disabled={isListening}
              />
            </div>
            
            {/* Voice Search Button */}
            {speechSupported && (
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleListening}
                className={cn(
                  "h-8 w-8 p-0 transition-colors",
                  isListening 
                    ? "bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/30" 
                    : "hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                )}
                title={isListening ? "Stop listening" : "Start voice search"}
              >
                {isListening ? (
                  <MicOff className="h-4 w-4" />
                ) : (
                  <Mic className="h-4 w-4" />
                )}
              </Button>
            )}
            
            <div className="flex items-center space-x-2 flex-shrink-0">
              <kbd className="hidden sm:inline-flex h-5 px-1.5 font-mono text-xs font-medium text-zinc-400 bg-zinc-100 dark:bg-zinc-800 border rounded">
                ESC
              </kbd>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                className="h-6 w-6 p-0 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          {localQuery && (
            <DialogDescription className="text-sm text-zinc-600 dark:text-zinc-400 mt-2">
              {status === "loading" || status === "stalled" ? (
                <span className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-3 w-3 border-2 border-zinc-300 border-t-zinc-600"></div>
                  <span>Searching...</span>
                </span>
              ) : results?.hits ? (
                `${results.hits.length} result${results.hits.length !== 1 ? 's' : ''} for "${localQuery}"`
              ) : (
                `No results for "${localQuery}"`
              )}
            </DialogDescription>
          )}
          
          {/* Voice search indicator */}
          {isListening && (
            <div className="flex items-center space-x-2 mt-2 text-sm text-red-600 dark:text-red-400">
              <div className="flex space-x-1">
                <div className="w-1 h-4 bg-red-500 rounded-full animate-pulse"></div>
                <div className="w-1 h-3 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-1 h-5 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-1 h-2 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }}></div>
              </div>
              <span>Listening for voice input...</span>
            </div>
          )}
        </DialogHeader>

        {/* Search Results */}
        <div className="flex-1 overflow-y-auto max-h-[calc(80vh-120px)]">
          {!localQuery ? (
            <div className="flex flex-col items-center justify-center py-12 text-center px-6">
              <div className="rounded-full bg-zinc-100 dark:bg-zinc-800 p-3 mb-4">
                <Search className="h-6 w-6 text-zinc-400" />
              </div>
              <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 mb-2">
                Search Products
              </h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-sm mb-4">
                Start typing to search through our product catalog
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-zinc-400">
                <kbd className="px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded border">
                  <Command className="h-3 w-3 inline mr-1" />K
                </kbd>
                <span>to search</span>
                <span>•</span>
                <kbd className="px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded border">
                  ↑↓
                </kbd>
                <span>to navigate</span>
                <span>•</span>
                <kbd className="px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded border">
                  ↵
                </kbd>
                <span>to select</span>
                {speechSupported && (
                  <>
                    <span>•</span>
                    <kbd className="px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded border flex items-center">
                      <Mic className="h-3 w-3 mr-1" />
                      voice
                    </kbd>
                    <span>to speak</span>
                  </>
                )}
              </div>
            </div>
          ) : localQuery && hits && hits.length > 0 ? (
            <div className="p-6">
              <Configure hitsPerPage={8} />
              <div className="space-y-1">
                {hits.map((hit, index) => (
                  <div 
                    key={hit.objectID || index} 
                    className={cn(
                      "border border-transparent rounded-lg p-3 transition-colors",
                      selectedIndex === index 
                        ? "bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700" 
                        : "hover:bg-zinc-50 dark:hover:bg-zinc-900"
                    )}
                  >
                    <Hit hit={hit} />
                  </div>
                ))}
              </div>
              <div className="mt-6 border-t border-zinc-100 dark:border-zinc-800 pt-4">
                <CustomPagination />
              </div>
            </div>
          ) : localQuery && hits && hits.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center px-6">
              <div className="rounded-full bg-zinc-100 dark:bg-zinc-800 p-3 mb-4">
                <Search className="h-6 w-6 text-zinc-400" />
              </div>
              <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 mb-2">
                No results found
              </h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Try adjusting your search or browse our categories
              </p>
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GlobalSearchModal;