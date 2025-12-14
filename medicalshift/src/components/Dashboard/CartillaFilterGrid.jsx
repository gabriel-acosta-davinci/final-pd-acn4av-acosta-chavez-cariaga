import filters from "../../data/filters.js";
import FilterCard from "../MedicalDirectory/FilterCard.jsx";

export default function CartillaFilterGrid({ onFilterSelect }) {
    return (
        <div className="flex justify-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
                {filters.map((filter) => (
                    <FilterCard
                        key={filter.label}
                        icon={filter.icon}
                        label={filter.label}
                        onClick={() => onFilterSelect(filter.label)}
                    />
                ))}
            </div>
        </div>
    );
}



