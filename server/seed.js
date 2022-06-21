require("dotenv").config();
const User = require("./db/User");
const { connectDB, mongoUrl } = require("./app");

const seed = async () => {
  await connectDB(mongoUrl);
  const user1 = new User({
    username: "thomas",
    email: "thomas@gmail.com",
    password: "123123",
  });
  const user2 = new User({
    username: "john",
    email: "john@gmail.com",
    password: "123123",
  });
  const user3 = new User({
    username: "bill",
    email: "bill@gmail.com",
    password: "123123",
  });
  const user4 = new User({
    username: "anna",
    email: "anna@gmail.com",
    password: "123123",
  });
  const user5 = new User({
    username: "taylor",
    email: "taylor@gmail.com",
    password: "123123",
  });
  const user6 = new User({
    username: "lee",
    email: "lee@gmail.com",
    password: "123123",
  });
  await user1.save();
  await user2.save();
  await user3.save();
  await user4.save();
  await user5.save();
  await user6.save();
  console.log("DB seeded");
};
seed();
