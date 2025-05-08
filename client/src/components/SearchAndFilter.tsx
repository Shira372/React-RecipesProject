import React, { useState } from "react";
import { TextField, MenuItem, Select, FormControl, InputLabel, Button, Box, Paper, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useRecipes } from "../use-Context/recipeProvider";
import { useCategories } from "../use-Context/categoryProvider";

const difficulties = [
    { id: 1, name: "קל" },
    { id: 2, name: "בינוני" },
    { id: 3, name: "קשה" },
];

const SearchAndFilter = () => {
    const { categories } = useCategories(); // משתמשים רק ב- useCategories
    const [filterType, setFilterType] = useState(""); // סוג הסינון שנבחר
    const [filterValue, setFilterValue] = useState(""); // הערך שנבחר לסינון
    const [openSearch, setOpenSearch] = useState(false); // מציין אם התיבה פתוחה או סגורה
    const { recipes, setRecipes } = useRecipes();

    // פונקציה שמבצעת סינון על המתכונים
    const filterRecipes = () => {
        return recipes.filter((recipe) => {
            if (filterType === "difficulty" && filterValue) {
                return recipe?.Difficulty === Number(filterValue); // סינון לפי id של הקושי
            }
            if (filterType === "duration" && filterValue) {
                return recipe?.Duration <= Number(filterValue);
            }
            if (filterType === "createdBy" && filterValue) {
                return recipe?.UserId === Number(filterValue);
            }
            if (filterType === "category" && filterValue) {
                return String(recipe?.Difficulty) === String(filterValue);
            }
            return true;
        });
    };


    const handleSearch = () => {
        const filteredRecipes = filterRecipes();
        setRecipes(filteredRecipes);
        filteredRecipes.length === 0 && alert("לא נמצאו מתכונים מתאימים לחיפוש");
        console.log("מתכונים מפולטרים:", filteredRecipes);
    };

    return (
        <Box sx={{ textAlign: "center" }}>
            <Button
                variant="outlined"
                color="primary"
                onClick={() => setOpenSearch(!openSearch)}
                sx={{
                    mb: 3,
                    fontWeight: "bold",
                    borderRadius: 2,
                    transition: "0.3s",
                    "&:hover": { backgroundColor: "#fff", color: "#444" },
                    borderColor: "#444",
                    backgroundColor: "#444",
                    color: "#fff"
                }}
            >
                {openSearch ? "סגור חיפוש" : "חיפוש"}
            </Button>
            {openSearch && (
                <Paper elevation={3} sx={{ padding: 3, borderRadius: 3, backgroundColor: "#fff", maxWidth: 400, mx: "auto" }}>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold", textAlign: "center" }}>🔎 חיפוש מתכונים</Typography>

                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel sx={{ color: "#444" }}>בחר סינון</InputLabel>
                        <Select
                            value={filterType}
                            onChange={(e) => { setFilterType(e.target.value); setFilterValue(""); }}
                            sx={{ "& .MuiSelect-select": { color: "#444" }, "& .MuiOutlinedInput-root": { "& fieldset": { borderColor: "#444" } } }}
                        >
                            <MenuItem value="category">קטגוריה</MenuItem>
                            <MenuItem value="duration">משך זמן</MenuItem>
                            <MenuItem value="difficulty">רמת קושי</MenuItem>
                            <MenuItem value="createdBy">נוצר ע"י</MenuItem>
                        </Select>
                    </FormControl>

                    {filterType === "category" && (
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel sx={{ color: "#444" }}>בחר קטגוריה</InputLabel>
                            <Select
                                value={filterValue}
                                onChange={(e) => setFilterValue(e.target.value)}
                                sx={{ "& .MuiSelect-select": { color: "#444" }, "& .MuiOutlinedInput-root": { "& fieldset": { borderColor: "#444" } } }}
                            >
                                {categories.map((cat) => (
                                    <MenuItem key={cat.Id} value={cat.Id}>{cat.Name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    )}

                    {filterType === "difficulty" && (
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel sx={{ color: "#444" }}>בחר רמת קושי</InputLabel>
                            <Select
                                value={filterValue}
                                onChange={(e) => setFilterValue(e.target.value)}
                                sx={{ "& .MuiSelect-select": { color: "#444" }, "& .MuiOutlinedInput-root": { "& fieldset": { borderColor: "#444" } } }}
                            >
                                {difficulties.map((diff) => (
                                    <MenuItem key={diff.id} value={diff.id}>{diff.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    )}

                    {filterType === "duration" && (
                        <TextField
                            fullWidth
                            type="number"
                            label="משך זמן (דקות)"
                            value={filterValue}
                            onChange={(e) => setFilterValue(e.target.value)}
                            sx={{
                                mb: 2,
                                "& .MuiInputBase-root": { color: "#444" },
                                "& .MuiOutlinedInput-root": { "& fieldset": { borderColor: "#444" } }
                            }}
                        />
                    )}

                    {filterType === "createdBy" && (
                        <TextField
                            fullWidth
                            label="שם יוצר המתכון"
                            value={filterValue}
                            onChange={(e) => setFilterValue(e.target.value)}
                            sx={{
                                mb: 2,
                                "& .MuiInputBase-root": { color: "#444" },
                                "& .MuiOutlinedInput-root": { "& fieldset": { borderColor: "#444" } }
                            }}
                        />
                    )}

                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        startIcon={<SearchIcon />}
                        onClick={handleSearch}
                        disabled={!filterType || !filterValue}
                        sx={{
                            fontWeight: "bold",
                            borderRadius: 2,
                            transition: "0.3s",
                            backgroundColor: "#333",
                            "&:hover": { backgroundColor: "#333" },
                            "&:disabled": { backgroundColor: "#ccc" },
                        }}
                    >
                        חפש
                    </Button>
                </Paper>
            )}
        </Box>
    );
};

export default SearchAndFilter;
