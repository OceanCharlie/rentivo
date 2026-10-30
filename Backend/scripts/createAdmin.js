// Usage: npm run create-admin -- "Admin Name" admin@example.com <password>
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env"), quiet: true });
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/UserSchema");

const [name, email, password] = process.argv.slice(2);

if (!name || !email || !password) {
  console.log('Usage: npm run create-admin -- "Admin Name" admin@example.com <password>');
  process.exit(1);
}

(async () => {
  await mongoose.connect(process.env.MONGO_DB);
  const hashedPassword = await bcrypt.hash(password, 10);
  await User.findOneAndUpdate(
    { email: email.toLowerCase() },
    { name, email, password: hashedPassword, type: "Admin", granted: "granted" },
    { upsert: true }
  );
  console.log(`Admin ${email} is ready`);
  await mongoose.disconnect();
})().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
