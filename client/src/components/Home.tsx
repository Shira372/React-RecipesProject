import { Link, Outlet } from "react-router-dom"
import { UserContext, useUser } from "../use-Context/userProvider"
import Recipes from "./Recipes";
import { AppBar, Toolbar, Typography, Button, Avatar, Box } from '@mui/material';
import { use, useContext, useEffect, useState } from "react"
import React from 'react';

const Home = () => {
    const { user } = useUser(); // שימוש בפונקציה הבטוחה
    const [showAddRecipe, setShowAddRecipe] = useState(false); // מצב להצגת הכפתור

    useEffect(() => {
        if (user?.Id !== 0) {
            setShowAddRecipe(true);
        } else {
            setShowAddRecipe(false);
        }
    }, [user]);
    return (
        <>
            <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 20px" }}>

                <div style={{ display: "flex", gap: "15px" }}>

                    <Link to="Login">
                        <Button sx={{ color: "#333" }}>Login</Button>
                    </Link>

                    <Link to="SignUp">
                        <Button sx={{ color: "#333" }}>Sign Up</Button>
                    </Link>
                    {user?.Id != undefined && showAddRecipe && ( // מציג רק אם המשתמש מחובר
                        <Link to="addRecipe">
                            <Button
                                variant="contained"
                                sx={{ backgroundColor: "#333", color: "white", "&:hover": { backgroundColor: "#555" } }}
                            >
                                Add New Recipe
                            </Button>
                        </Link>
                    )}
                </div>
                <Box sx={{ display: "flex", alignItems: "center", paddingRight: "10%" }}>
                    <Avatar sx={{ bgcolor: "#333" }}>
                        {user?.Name?.charAt(0).toUpperCase() || "❔"}
                    </Avatar>
                </Box>
            </header>
            <Outlet />
            <h1>One Click<img src="/images/my-logo.png" alt="Logo" style={{ width: '80px', height: 'auto', marginRight: '0px' }} />, Endless Flavors...</h1>
            <Recipes />
            <h4 style={{ fontSize: '1.8rem', display: 'flex', alignItems: 'center' }}>
                © by <img src="/images/my-logo.png" alt="Logo" style={{ width: '170px', height: 'auto', marginRight: '170px' }} />
            </h4>

        </>
    )
}

export default Home;