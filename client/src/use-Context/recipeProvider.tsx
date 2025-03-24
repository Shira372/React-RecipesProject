import React,{ createContext, ReactElement, useContext, useState } from "react";
import { Rec } from "../moduls/recipe";

type RecipeContextType = {
    recipes: Rec[];
    setRecipes: (recipes: Rec[]) => void;
};

export const RecipeContext = createContext<RecipeContextType | undefined>(undefined);

const RecipeProvider = ({ children }: { children: ReactElement }) => {
    const [recipes, setRecipes] = useState<Rec[]>([]);

    return (
        <RecipeContext.Provider value={{ recipes, setRecipes }}>
            {children}
        </RecipeContext.Provider>
    );
};

export const useRecipes = (): RecipeContextType => {
    const context = useContext(RecipeContext);
    if (!context) {
        throw new Error("useRecipes must be used within a RecipeProvider");
    }
    return context;
};

export default RecipeProvider;