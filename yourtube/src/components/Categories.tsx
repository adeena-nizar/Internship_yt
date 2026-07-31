import React, { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const categories = [
  "All",
  "Music",
  "Gaming",
  "Movies",
  "Live",
  "News",
  "Technology",
  "Education",
  "Sports",
  "Fashion",
  "Podcasts",
  "JavaScript",
  "React",
  "Travel",
  "Cooking",
];

interface CategoriesProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

const Categories: React.FC<CategoriesProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const { scrollLeft, clientWidth } = scrollContainerRef.current;
      const scrollAmount = clientWidth * 0.8;
      const newScrollLeft =
        direction === "left"
          ? scrollLeft - scrollAmount
          : scrollLeft + scrollAmount;
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      });
    }
  };

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      setIsScrolled(scrollContainerRef.current.scrollLeft > 0);
    }
  };

  return (
    <div className="relative">
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex space-x-3 overflow-x-auto pb-4 scrollbar-hide"
      >
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onSelectCategory(category)}
            className={`px-4 py-2 rounded-lg whitespace-nowrap text-sm font-medium transition-colors duration-200 ${
              selectedCategory === category
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }`}
          >
            {category}
          </button>
        ))}
      </div>
      {isScrolled && (
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 transform bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-md hover:bg-gray-100 transition-all"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      )}
      <button
        onClick={() => scroll("right")}
        className="absolute right-0 top-1/2 -translate-y-1/2 transform bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-md hover:bg-gray-100 transition-all"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
};

export default Categories;