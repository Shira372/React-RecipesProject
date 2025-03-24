import React, { createContext, ReactElement, useContext, useState } from "react";
import { Category } from "../moduls/category"; 

type CategoryContextType = {
    categories: Category[]; 
    setCategories: (categories: Category[]) => void; 
};

export const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

const CategoryProvider = ({ children }: { children: ReactElement }) => {
    const [categories, setCategories] = useState<Category[]>([]); 

    return (
        <CategoryContext.Provider value={{ categories, setCategories }}>
            {children}
        </CategoryContext.Provider>
    );
};

export const useCategories = (): CategoryContextType => {
    const context = useContext(CategoryContext); 
    if (!context) {
        throw new Error("useCategories must be used within a CategoryProvider"); 
    }
    return context; 
};

export default CategoryProvider; 
