import { useState } from "react";
import { Checkbox, Button, UnstyledButton, ScrollArea } from "@mantine/core";
import { IconChevronDown } from "@tabler/icons-react";

interface CategoryFilterProps {
  categories: any[];
  selectedFilters: any;
  handleSelection: (type: "categories" | "brands", id: any) => void;
  isInitial: boolean;
}

export default function CategoryFilter({
  categories,
  selectedFilters,
  handleSelection,
  isInitial,
}: CategoryFilterProps) {
  const [showAll, setShowAll] = useState(false);

  const displayCategories = showAll ? categories : categories.slice(0, 10);

  return (
    <div>
      {categories?.length > 0 ? (
        <>
          <ScrollArea
            h={showAll ? 350 : "auto"} // only restrict height when showing all
            type={showAll ? "always" : "never"} // controls scrollbar visibility
            scrollbarSize={6}
            // overscrollBehavior="contain"
            className={`${
              showAll ? "max-h-[310px] pr-2" : "max-h-none overflow-hidden"
            }`}
          >
            {displayCategories.map((category) => (
              <div className="flex gap-x-1" key={category.id}>
                <Checkbox
                  size="xs"
                  color={"#D85338"}
                  label={<p className="text-sm">{category?.categoryName}</p>}
                  checked={selectedFilters?.categories.includes(category.id)}
                  onChange={() => handleSelection("categories", category.id)}
                  className="mb-2"
                  styles={{
                    body: {
                      alignItems: "center",
                    },
                  }}
                />
              </div>
            ))}
          </ScrollArea>

          {categories.length > 10 && !showAll && (
            <UnstyledButton
              onClick={() => setShowAll(true)}
              className="text-sm text-orange-700 underline mt-2 flex items-center gap-1"
            >
              See more <IconChevronDown size={16} />
            </UnstyledButton>
          )}
        </>
      ) : (
        isInitial && categories.length === 0 && <div>No Categories found</div>
      )}
    </div>
  );
}
