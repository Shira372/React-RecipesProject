import React, { useState, useEffect } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { TextField, Button, Grid, Card, CardContent, Typography, Select, MenuItem, IconButton, FormControl, InputLabel, styled } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import axios from "axios";
import { useUser } from "../use-Context/userProvider";
import { useNavigate } from "react-router-dom";
import { useCategories } from "../use-Context/categoryProvider";
import { Box } from "@mui/material";

// יצירת schema validation עם Yup
const recipeSchema = Yup.object().shape({
  Name: Yup.string().required("שם המתכון חובה"),
  Instructions: Yup.string().required("הוראות הכנה חובה"),
  Difficulty: Yup.string().required("רמת קושי חובה"),
  Duration: Yup.number()
    .required("זמן הכנה חובה")
    .positive("הזמן חייב להיות חיובי"),
  Description: Yup.string().required("תיאור חובה"),
  Category: Yup.string().required("קטגוריה חובה"),
  Img: Yup.string()
    .url("כתובת תמונה לא תקינה")
    .required("קישור לתמונה חובה"),
  Ingredients: Yup.array()
    .of(
      Yup.object().shape({
        Name: Yup.string().required("שם מוצר חובה"),
        Count: Yup.string().required("כמות חובה"),
        Type: Yup.string().required("סוג כמות חובה"),
      })
    )
    .required("יש להזין לפחות מרכיב אחד")
    .min(1, "יש להזין לפחות מרכיב אחד"),
});

// הגדרת סוגי הנתונים של הטופס
type FormValues = {
  Name: string;
  Instructions: string;
  Difficulty: string;
  Duration: number;
  Description: string;
  Category: string;
  Img: string;
  Ingredients: Array<{
    Name: string;
    Count: string;
    Type: string;
  }>;
};

// עיצוב מותאם אישית
const CustomTextField = styled(TextField)({
  width: "100%",
  marginBottom: "20px",
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "#444",
    },
    "&:hover fieldset": {
      borderColor: "#444",
    },
  },
  "& .MuiInputLabel-root": {
    color: "#444",
  },
});

const CustomButton = styled(Button)({
  backgroundColor: "#444",
  color: "white",
  padding: "10px 0",
  borderRadius: "8px",
  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
  "&:hover": {
    backgroundColor: "#666",
  },
});

const AddRecipeForm = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const userId = user.Id;
  const { categories, setCategories } = useCategories();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(recipeSchema),
    defaultValues: {
      Name: "",
      Instructions: "",
      Difficulty: "",
      Duration: 0,
      Description: "",
      Category: "",
      Img: "",
      Ingredients: [{ Name: "", Count: "", Type: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "Ingredients",
  });

  const onSubmit = async (data: FormValues) => {
    const mappedIngredients = data.Ingredients.map((item) => ({
      Name: item.Name,
      Count: item.Count,
      Type: item.Type,
    }));

    const payload = {
      Name: data.Name,
      UserId: userId,
      Instructions: [{ Name: data.Instructions }],
      Difficulty: data.Difficulty,
      Duration: data.Duration,
      Description: data.Description,
      CategoryId: Number(data.Category),
      Img: data.Img,
      Ingridents: mappedIngredients,
    };

    try {
      const response = await axios.post("http://localhost:8080/api/recipe", payload);
      console.log("מתכון נוסף בהצלחה:", response.data);
      alert("מתכון נוסף בהצלחה:");
      navigate("/home");
    } catch (error) {
      console.error("שגיאת שרת", error);
    }
  };

  return (
    <Card sx={{ maxWidth: 600, margin: "auto", mt: 4, p: 2 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          הוספת מתכון
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box>
            <Grid container spacing={2}>
              {/* שם המתכון */}
              <Grid item xs={12}>
                <CustomTextField
                  label="שם המתכון"
                  fullWidth
                  {...register("Name")}
                  error={!!errors.Name}
                  helperText={errors.Name?.message}
                />
              </Grid>
              {/* הוראות הכנה */}
              <Grid item xs={12}>
                <CustomTextField
                  label="הוראות הכנה"
                  fullWidth
                  multiline
                  rows={3}
                  {...register("Instructions")}
                  error={!!errors.Instructions}
                  helperText={errors.Instructions?.message}
                />
              </Grid>
              {/* רמת קושי */}
              <Grid item xs={6}>
                <FormControl fullWidth error={!!errors.Difficulty}>
                  <InputLabel id="difficulty-label">רמת הקושי</InputLabel>
                  <Select
                    labelId="difficulty-label"
                    label="רמת הקושי"
                    defaultValue=""
                    {...register("Difficulty")}
                  >
                    <MenuItem value="קל">קל</MenuItem>
                    <MenuItem value="בינוני">בינוני</MenuItem>
                    <MenuItem value="קשה">קשה</MenuItem>
                  </Select>
                </FormControl>
                {errors.Difficulty && (
                  <Typography variant="caption" color="error">
                    {errors.Difficulty.message}
                  </Typography>
                )}
              </Grid>
              {/* זמן הכנה */}
              <Grid item xs={6}>
                <CustomTextField
                  label="זמן הכנה (דקות)"
                  type="number"
                  fullWidth
                  {...register("Duration")}
                  error={!!errors.Duration}
                  helperText={errors.Duration?.message}
                />
              </Grid>
              {/* תיאור קצר */}
              <Grid item xs={12}>
                <CustomTextField
                  label="תיאור קצר"
                  fullWidth
                  {...register("Description")}
                  error={!!errors.Description}
                  helperText={errors.Description?.message}
                />
              </Grid>
              {/* קטגוריה */}
              <Grid item xs={12}>
                <FormControl fullWidth error={!!errors.Category}>
                  <InputLabel id="category-label">קטגוריה</InputLabel>
                  <Controller
                    name="Category"
                    control={control}
                    render={({ field }) => (
                      <Select {...field} labelId="category-label" label="קטגוריה">
                        {categories.map((category) => (
                          <MenuItem key={category.Id} value={category.Id}>
                            {category.Name}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                </FormControl>
              </Grid>
              {/* קישור לתמונה */}
              <Grid item xs={12}>
                <CustomTextField
                  label="קישור לתמונה"
                  fullWidth
                  {...register("Img")}
                  error={!!errors.Img}
                  helperText={errors.Img?.message}
                />
              </Grid>
              {/* כותרת קבוצת מרכיבים */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                  מרכיבים
                </Typography>
              </Grid>
              {/* מרכיבים - דינמיים */}
              {fields.map((item, index) => (
                <Grid container spacing={2} key={item.id} alignItems="center" sx={{ mb: 1 }}>
                  <Grid item xs={4}>
                    <CustomTextField
                      label="שם מוצר"
                      fullWidth
                      {...register(`Ingredients.${index}.Name`)}
                      error={!!errors.Ingredients?.[index]?.Name}
                      helperText={errors.Ingredients?.[index]?.Name?.message}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <CustomTextField
                      label="כמות"
                      fullWidth
                      {...register(`Ingredients.${index}.Count`)}
                      error={!!errors.Ingredients?.[index]?.Count}
                      helperText={errors.Ingredients?.[index]?.Count?.message}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <CustomTextField
                      label="סוג כמות"
                      fullWidth
                      {...register(`Ingredients.${index}.Type`)}
                      error={!!errors.Ingredients?.[index]?.Type}
                      helperText={errors.Ingredients?.[index]?.Type?.message}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <IconButton onClick={() => remove(index)} color="secondary">
                      <RemoveIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              ))}
              {/* כפתור הוספת מרכיב */}
              <Grid item xs={12}>
                <CustomButton
                  onClick={() => append({ Name: "", Count: "", Type: "" })}
                  startIcon={<AddIcon />}
                  sx={{ width: "40%" }}
                >
                  הוסף מרכיב
                </CustomButton>
              </Grid>

              {/* כפתור שליחה */}
              <Grid item xs={12}>
                <CustomButton type="submit" fullWidth>
                  הוסף מתכון
                </CustomButton>
              </Grid>
            </Grid>
          </Box>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddRecipeForm;
