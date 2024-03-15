const fs = require("fs");
require('colors');
const dotenv = require("dotenv");
const Sites = require("../Models/sitesModel");
const dataConnect = require("./Config/dbConnection");

dotenv.config({ path: ".env" });

dataConnect();

const sites = JSON.pare(fs.readFileSync("./sites.json"));

//insert data into database
const insertData = async () => {
  try {
    await Sites.create(sites);
    console.log("Data Inserted".green.inverse);
    process.exit();
  } catch (error) {
    console.log(error);
  }
};




//delete data from database 
const destroyData = async () => {
    try {
      await Sites.deleteMany();
      console.log("Data Deleted".red.inverse);
      process.exit();
    } catch (error) {
      console.log(error);
    }
  };



//running  node script.js -i or node script.js -d 
if (process.argv[2] == '-i'){                  
    insertData();
}else if (process.argv[2] == '-d')
{
    destroyData();
}
