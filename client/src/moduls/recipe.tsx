import {Ingredient} from "./ingredient";
import { Instructions } from "./instructions";

export type Rec = {
    Id: number;
    Name: string;
    Img: string;
    Duration: number;
    Difficulty: number;
    Description: string;
    Category: number;
    Instructions: Instructions[];  
    Ingridents: Ingredient[]; 
    UserId:number
};

