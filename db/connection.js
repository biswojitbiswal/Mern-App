const mongoose = require("mongoose");

// const PORT = process.env.PORT;
const dbUrl = process.env.DB;

main()
    .then(() => {
        console.log(`connection successful`);
    }).catch((err) => {
        console.log(err);
    });

async function main(){
    await mongoose.connect(dbUrl);
}

