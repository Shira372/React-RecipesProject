import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { Rec } from '../moduls/recipe';
import { Navigate, useLocation } from 'react-router-dom';
import { UserContext, useUser } from '../use-Context/userProvider';
import { CardActions } from '@mui/material';
import { Card, CardContent, CardMedia, Button, Typography, Grid } from '@mui/material';
import { styled } from '@mui/system';
import { useNavigate } from "react-router-dom";
import cookiesImg from '../images/cookies.webp';
import { useRecipes } from '../use-Context/recipeProvider';
import { Ingredient } from '../moduls/ingredient';


//mui עיצוב מותאם אישית לכרטיסים בשיתוף 
const PageContainer = styled('div')({
  padding: '20px',
  backgroundColor: 'rgba(255, 255, 255, 0.3)',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
});

const RecipeGrid = styled(Grid)({
  maxWidth: '1200px',
});

const CustomCard = styled(Card)({
  backgroundColor: 'rgb(255, 255, 255)',
  color: 'rgb(61, 53, 53)',
  borderRadius: '12px',
  boxShadow: '0px 4px 12px rgb(92, 86, 86)',
  '&:hover': {
    boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.4)',
  },
  width: '100%',
});

const CustomButton = styled(Button)({
  width: '120px',
  backgroundColor: '#333',
  color: 'white',
  padding: '8px 16px',
  borderRadius: '8px',
  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
  '&:hover': {
    backgroundColor: '#555',
    boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.2)',
  },
  marginRight: '10px',
});

const CardActionsStyled = styled(CardActions)({
  display: 'flex',
  justifyContent: 'flex-start',
  padding: '16px',
  position: 'relative',
  bottom: '0',
  left: '0',
  width: '100%',
});

const Recipe = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const { recipes, setRecipes } = useRecipes();

  const fetchRecipes = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/recipe");
      const formattedRecipes = response.data.map((recipe: any) => ({
        ...recipe,
        Instructions: recipe.Instructions.map((i: any) => i.Name).join(", ")
      }));
      setRecipes(formattedRecipes);
    } catch (err) {
      console.log("error");
    }
  };

  useEffect(() => {
    console.log("laoding.......");
    fetchRecipes();
  }, [location]);

  // פונקצית מחיקת מתכון
  const delRecipe = async (recipe: Rec) => {
    console.log("in recipe page user id is:", user.Id);
    if (recipe.UserId === user.Id) {
      try {
        await axios.post(`http://localhost:8080/api/recipe/delete/${recipe.Id}`);
        console.log("המתכון נמחק בהצלחה");
        fetchRecipes();
      } catch (err) {
        console.error("שגיאת שרת:", err);
      }
    } else {
      alert("אין לך הרשאה למחיקת מתכון זה-הרשאה ניתנת לבעל המתכון בלבד");
    }
  };

  // פונקצית עריכת מתכון
  const editRecipe = (recipe: Rec) => {
    navigate(`/home/edit/${recipe.Id}`, { state: { recipe } });
    fetchRecipes();
  }

  return (
    <PageContainer>
      <RecipeGrid container spacing={4} justifyContent="center">
        <Grid item xs={12}>
          <Typography variant="h3" align="center" style={{ marginBottom: '20px', color: '#333' }}>
            🍪להיטי המטבח
          </Typography>
        </Grid>

        {recipes.map((recipe) => (
          <Grid item xs={12} sm={6} key={recipe?.Id} display="flex" justifyContent="center">
            <CustomCard>
              <CardMedia
                component="img"
                height="250"
                image={recipe?.Img || cookiesImg} // אם אין תמונה, מציגים תמונה ברירת מחדל
                //alt="תמונה של עוגיות"
              />

              <CardContent>
                <Typography gutterBottom variant="h5">{recipe.Name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>משך הכנה:</strong> {recipe.Duration} <br />
                  <strong>רמת קושי:</strong> {recipe.Difficulty} <br />
                  <strong>תיאור:</strong> {recipe.Description} <br />
                  <strong>הוראות:</strong> {recipe.Instructions[0]?.Name || "לא נמסרו הוראות"} <br />

                </Typography>
              </CardContent>

              <Typography variant="h6" sx={{ marginTop: 2 }}>רכיבים:</Typography>

              <ul style={{ padding: 0, margin: 0, listStyleType: "none" }}>
                {recipe.Ingridents.map((ingredient, index) => (
                  <li key={index} style={{ marginBottom: "5px" }}>
                    {ingredient.Name} - {ingredient.Count} {ingredient.Type}
                  </li>
                ))}
              </ul>
              {/* הכפתורים יופיעו בתוך כל כרטיס בנפרד */}
              <CardActionsStyled>
                <CustomButton size="small" onClick={() => delRecipe(recipe)}>
                  Delete
                </CustomButton>
                <CustomButton size="small" onClick={() => editRecipe(recipe)}>
                  Edit
                </CustomButton>
              </CardActionsStyled>
            </CustomCard>
          </Grid>
        ))}
      </RecipeGrid>
    </PageContainer>
  )
};

export default Recipe;