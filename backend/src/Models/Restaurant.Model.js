import db from "../config/db.js";

export const Register = async ({
  Restaurant_ID,
  First_Name,
  Last_Name,
  Business_Name,
  Business_Email,
  Password,
  Business_Type,
  Phone_Number,
  City,
  Province,
  Area,
  Postal_Code,
  Detail_Address,
  Operating_licence,
  FBR,
  Account_Title,
  Bank_Name,
  IBAN,
  Owner_ID,
  Front_img = null,
  Back_img = null,
  Profile_pic = null,
}) => {
  try {
    const sql = `INSERT INTO RESTAURANTS (Restaurant_ID,First_Name,Last_Name,Business_Name,Business_Email,Password,Business_Type,Phone_Number,City,Province,Area,Postal_Code,Detail_Address,Operating_licence,FBR,Account_Title,Bank_Name,IBAN,Owner_ID,Front_img,Back_img,Profile_pic)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
    const values = [
      Restaurant_ID,
      First_Name,
      Last_Name,
      Business_Name,
      Business_Email,
      Password,
      Business_Type,
      Phone_Number,
      City,
      Province,
      Area,
      Postal_Code,
      Detail_Address,
      Operating_licence,
      FBR,
      Account_Title,
      Bank_Name,
      IBAN,
      Owner_ID,
      Front_img,
      Back_img,
      Profile_pic,
    ];
    const [result] = await db.execute(sql, values);
    return result.affectedRows;
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
};

export const chkBusiness = async ({ Business_Email }) => {
  try {
    const sql = `SELECT * FROM RESTAURANTS WHERE Business_Email=?`;
    const values = [Business_Email];
    const [rows] = await db.execute(sql, values);
    return rows.length > 0 ? rows[0] : null; // Return restaurant if found, otherwise null
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
};
