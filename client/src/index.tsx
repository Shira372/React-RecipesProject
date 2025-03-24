import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import Login from './components/Login'
import SignUp from './components/SignUp'
import Home from './components/Home'
import AddRecipeForm from './components/AddRecipe'
import EditRecipe from './components/EditRecipe'
import UserProvider from './use-Context/userProvider'
import CategoryProvider, {CategoryContext} from './use-Context/categoryProvider'
import RecipeProvider from './use-Context/recipeProvider'
const routs = createBrowserRouter([
  {
    path: '/', // דף הבית הראשי
    element: <App />,
    children: [
      {
        path: '/', // דף הבית הראשי
        element: <Navigate to="/home" />, // הפניה אוטומטית ל-home
      },
    ],
  },
  {
    path: '/home', // דף הבית
    element: <Home />, // קומפוננטת Home
    children: [
      { path: 'login', element: <Login /> },
      { path: 'signUp', element: <SignUp /> },
      { path: 'addRecipe', element: <AddRecipeForm /> },
      { path: 'edit/:id', element: <EditRecipe /> }, // נתיב עריכת מתכון עם ID כפרמטר

    ],
  },
]);
createRoot(document.getElementById('root')!).render(
  <CategoryProvider>
    <>
      <UserProvider>
        <>
          <RecipeProvider>
            <>
              <RouterProvider router={routs} />,
            </>
          </RecipeProvider>
        </>
      </UserProvider>
    </>
  </CategoryProvider> 
);

