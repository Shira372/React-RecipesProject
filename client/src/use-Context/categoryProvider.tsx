import React, { createContext, ReactElement, useContext, useEffect, useState } from "react";
import axios from "axios";
import { Category } from "../moduls/category"; // ודא שהמודול Category מוגדר כראוי

type CategoryContextType = {
  categories: Category[];
  setCategories: (categories: Category[]) => void;
};

export const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

const CategoryProvider = ({ children }: { children: ReactElement }) => {
  const [categories, setCategories] = useState<Category[]>([]);

  // קריאה אוטומטית לשרת כדי לקבל את כל הקטגוריות
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/category");
        setCategories(res.data);
      } catch (error) {
        console.error("שגיאה בעת טעינת הקטגוריות:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <CategoryContext.Provider value={{ categories, setCategories }}>
      {children}
    </CategoryContext.Provider>
  );
};

// Hook מותאם לשימוש בקונטקסט
export const useCategories = (): CategoryContextType => {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error("useCategories חייב להיות בתוך CategoryProvider");
  }
  return context;
};

export default CategoryProvider;
