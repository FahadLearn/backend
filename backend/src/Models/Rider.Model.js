import db from "../config/db.js";

export const CreateRider = async ({
  First_Name,
  Last_Name,
  City,
  Vehicle,
  Cnic,
  Phone_No,
  Date_of_Birth,
  License,
  Payment_Method,
  Account_Title,
  RIDER_ID,
  Email,
  Password,
  IMG = Null,
}) => {
  try {
    const sql =
      "INSERT INTO rider(First_Name,Last_Name,City,Vehicle,Cnic,Phone_No,Date_of_Birth,License,Payment_Method,Account_Title,RIDER_ID,Email,Password,IMG) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
    const values = [
      First_Name,
      Last_Name,
      City,
      Vehicle,
      Cnic,
      Phone_No,
      Date_of_Birth,
      License,
      Payment_Method,
      Account_Title,
      RIDER_ID,
      Email,
      Password,
      IMG,
    ];
    const [result] = await db.execute(sql, values);
    return result.affectedRows;
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
};

export const FindById = async ({ Rider_ID }) => {
  try {
    const sql = "SELECT * FROM rider where RIDER_ID =?";
    const values = [Rider_ID];
    const [row] = await db.execute(sql, values);
    return row.length > 0 ? row[0] : null;
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
};

export const FindByEmail = async ({ Email }) => {
  try {
    const sql = "SELECT * FROM rider WHERE Email =?";
    const values = [Email];
    const [row] = await db.execute(sql, values);
    return row.length > 0 ? row[0] : null;
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
};

