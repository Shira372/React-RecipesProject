import axios from "axios";
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { TextField, Button, Grid, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { User } from '../moduls/user';
import React,{useState} from 'react';
import { UserContext,useUser } from "../use-Context/userProvider";
import { useNavigate } from 'react-router-dom';

export type UserForSignUp = {
  password: string;
  name: string;
  userName: string;
  phone: string;
  email: string;
  tz: string;
};

// סכמת ולידציה
const validationSchema = Yup.object({
  userName: Yup.string().required("שם המשתמש חובה").min(5, "שם המשתמש צריך להיות לפחות 5 תווים"),
  password: Yup.string().required("הסיסמה חובה").min(8, "הסיסמה צריכה להיות לפחות 8 תווים"),
  name: Yup.string().required("השם מלא חובה"),
  phone: Yup.string().required("הטלפון חובה").matches(/^[0-9]{10}$/, "הטלפון חייב להיות 10 ספרות"),
  email: Yup.string().email("כתובת אימייל לא תקינה").required("האימייל חובה"),
  tz: Yup.string().required("המספר ת.ז חובה").length(9, "תעודת הזהות צריכה להיות 9 ספרות"),
}).required()

const SignUp = () => {
  const { setUser } = useUser(); // שימוש בפונקציה הבטוחה
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm<UserForSignUp>({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = (data: UserForSignUp) => {
    signInUser(data);
  }

  const signInUser = async (data: UserForSignUp) => {
    try {
      const response = await axios.post<User>('http://localhost:8080/api/user/sighin',
        {
          UserName: data.userName,
          Password: data.password,
          Name: data.name,
          Phone: data.phone,
          Email: data.email,
          Tz: data.tz,
        }
      );
      console.log('המשתמש נרשם בהצלחה:', response.data);
      setUser({
        Id: response.data.Id,
        Password: response.data.Password,
        Name: response.data.Name,
        UserName: response.data.UserName,
        Phone: response.data.Phone,
        Email: response.data.Email,
        Tz: response.data.Tz
      });
      navigate('/home');  // ניווט לאחר ההתחברות
    } catch (error: any) {
      if (error.response) {
        console.error("שגיאת שרת:", error.response.status, error.response.data);
      } else if (error.request) {
        console.error("שגיאת רשת: אין תגובה מהשרת");
      } else {
        console.error("שגיאה לא צפויה:", error.message);
      }
    }
  };

  return (
    <div style={{ width: '50%', margin: '0 auto' }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h2>Sign Up</h2>
        <Grid container spacing={2} direction="column">
          {/* שדה שם משתמש */}
          <Grid item>
            <TextField
              label="שם משתמש"
              fullWidth
              {...register("userName")}
              error={!!errors.userName}
              helperText={errors.userName?.message}
              variant="outlined"
              InputProps={{
                style: { borderColor: '#333' }
              }}
            />
          </Grid>

          {/* שדה סיסמה עם כפתור עין */}
          <Grid item>
            <TextField
              label="סיסמה"
              type={showPassword ? "text" : "password"}
              fullWidth
              {...register("password")}
              error={!!errors.password}
              helperText={errors.password?.message}
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
                style: { borderColor: '#333' }
              }}
            />
          </Grid>

          {/* שדה שם מלא */}
          <Grid item>
            <TextField
              label="שם מלא"
              fullWidth
              {...register("name")}
              error={!!errors.name}
              helperText={errors.name?.message}
              variant="outlined"
              InputProps={{
                style: { borderColor: '#333' }
              }}
            />
          </Grid>

          {/* שדה טלפון */}
          <Grid item>
            <TextField
              label="טלפון"
              fullWidth
              {...register("phone")}
              error={!!errors.phone}
              helperText={errors.phone?.message}
              variant="outlined"
              InputProps={{
                style: { borderColor: '#333' }
              }}
            />
          </Grid>

          {/* שדה אימייל */}
          <Grid item>
            <TextField
              label="אימייל"
              type="email"
              fullWidth
              {...register("email")}
              error={!!errors.email}
              helperText={errors.email?.message}
              variant="outlined"
              InputProps={{
                style: { borderColor: '#333' }
              }}
            />
          </Grid>

          {/* שדה תעודת זהות */}
          <Grid item>
            <TextField
              label="תעודת זהות"
              fullWidth
              {...register("tz")}
              error={!!errors.tz}
              helperText={errors.tz?.message}
              variant="outlined"
              InputProps={{
                style: { borderColor: '#333' }
              }}
            />
          </Grid>

          {/* כפתור שליחה */}
          <Grid item>
            <Button type="submit" variant="contained" style={{ backgroundColor: '#333', color: 'white', width: '100%', padding: '10px', borderRadius: '8px' }}>
              Sign In
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

export default SignUp;
