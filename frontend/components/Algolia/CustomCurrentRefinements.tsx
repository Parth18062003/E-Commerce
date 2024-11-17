/*
import React from 'react';
import { useCurrentRefinements, UseCurrentRefinementsProps } from 'react-instantsearch';
import { X } from 'lucide-react'; // Import the "X" icon from lucide-react for removal

function CustomCurrentRefinements(props: UseCurrentRefinementsProps) {
  const { items, refine } = useCurrentRefinements(props);

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <div key={[item.indexName, item.label].join('/')} className="flex flex-wrap gap-2">
          <span className="font-semibold">{item.label}:</span>
          {item.refinements.map((refinement) => (
            <div
              key={refinement.label}
              className="flex items-center gap-1 bg-indigo-200 text-sm text-indigo-600 px-3 py-1 rounded-lg"
            >
              <span>{refinement.label}</span>
              <button
                type="button"
                className="text-zinc-600 hover:text-zinc-800"
                onClick={(event) => {
                  if (isModifierClick(event)) {
                    return;
                  }
                  refine(refinement); // Refine (remove the current filter)
                }}
              >
                <X size={16} /> {/!* X icon for removal *!/}
              </button>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function isModifierClick(event: React.MouseEvent) {
  const isMiddleClick = event.button === 1;

  return Boolean(
    isMiddleClick ||
      event.altKey ||
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey
  );
}

export default CustomCurrentRefinements;
*/
import React from 'react';
import { useCurrentRefinements, UseCurrentRefinementsProps } from 'react-instantsearch';
import { X } from 'lucide-react'; // Import the "X" icon from lucide-react for removal

function CustomCurrentRefinements(props: UseCurrentRefinementsProps) {
  const { items, refine } = useCurrentRefinements(props);

  return (
      <div className="flex flex-wrap gap-2">
        {items.map((item) => {
          // Filter out refinements for "variants.color" and "variants.sizes.size"
          if (item.attribute === "variants.color" || item.attribute === "variants.sizes.size") {
            return null; // Do not render these refinements
          }

          return (
              <div key={[item.indexName, item.label].join('/')} className="flex flex-wrap gap-2">
                <span className="font-semibold">{item.label}:</span>
                {item.refinements.map((refinement) => (
                    <div
                        key={refinement.label}
                        className="flex items-center gap-1 bg-indigo-200 text-sm text-indigo-600 px-3 py-1 rounded-lg"
                    >
                      <span>{refinement.label}</span>
                      <button
                          type="button"
                          className="text-zinc-600 hover:text-zinc-800"
                          onClick={(event) => {
                            if (isModifierClick(event)) {
                              return;
                            }
                            refine(refinement); // Refine (remove the current filter)
                          }}
                      >
                        <X size={16} /> {/* X icon for removal */}
                      </button>
                    </div>
                ))}
              </div>
          );
        })}
      </div>
  );
}

function isModifierClick(event: React.MouseEvent) {
  const isMiddleClick = event.button === 1;

  return Boolean(
      isMiddleClick ||
      event.altKey ||
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey
  );
}

export default CustomCurrentRefinements;
