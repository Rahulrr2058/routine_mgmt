import { Checkbox, ScrollArea, UnstyledButton } from "@mantine/core";
import { IconChevronDown } from "@tabler/icons-react";
import { useState } from "react";

interface BrandFilterProps {
  brands: any[];
  selectedFilters: any;
  handleSelection: (type: "categories" | "brands", id: any) => void;
  isInitial: boolean;
}

export default function BrandFilter({
  brands,
  selectedFilters,
  handleSelection,
  isInitial,
}: BrandFilterProps) {
  const [showAll, setShowAll] = useState(false);

  const displayBrands = showAll ? brands : brands.slice(0, 10);

  return (
    <div className="bg-[#f5f0e1] text-black p-3 rounded-md">
      {brands?.length > 0 ? (
        <>
          <ScrollArea
            h={showAll ? 300 : "auto"}
            type={showAll ? "always" : "never"}
            scrollbarSize={6}
            // overscrollBehavior="contain"
            className={`${
              showAll ? "max-h-[300px] pr-2" : "max-h-none overflow-hidden"
            } bg-[#f5f0e1] text-black`}
          >
            {displayBrands.map((brand) => (
              <div className="flex gap-x-1" key={brand.id}>
                <Checkbox
                  size="xs"
                  color={"#D85338"}
                  label={<p className="text-sm text-black">{brand?.brandName}</p>}
                  checked={selectedFilters?.brands.includes(brand.id)}
                  onChange={() => handleSelection("brands", brand.id)}
                  className="mb-2 cursor-pointer"
                  styles={{
                    body: {            
                      alignItems: "center",
                      cursor: "pointer",
                    },
                    label: {
                      cursor: "pointer",
                      color: "white",
                    },
                  }}
                />
              </div>
            ))}
          </ScrollArea>

          {brands.length > 10 && !showAll && (
            <UnstyledButton
              onClick={() => setShowAll(true)}
              className="text-sm text-orange-400 underline mt-2 flex items-center gap-1"
            >
              See more <IconChevronDown size={16} />
            </UnstyledButton>
          )}
        </>
      ) : (
        isInitial && brands.length === 0 && (
          <div className="text-gray-400">No Brands found</div>
        )
      )}
    </div>
  );
}
