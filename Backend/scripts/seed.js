// Creates demo accounts and properties. Usage: npm run seed
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env"), quiet: true });
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/UserSchema");
const Property = require("../models/PropertySchema");

const PASSWORD = "Test@123";

(async () => {
  await mongoose.connect(process.env.MONGO_DB);
  const hashedPassword = await bcrypt.hash(PASSWORD, 10);

  const upsertUser = (name, email, type) =>
    User.findOneAndUpdate(
      { email },
      { name, email, password: hashedPassword, type, granted: "granted" },
      { upsert: true, returnDocument: "after" }
    );

  await upsertUser("Admin Rentivo", "admin@rentivo.test", "Admin");
  const owner = await upsertUser("Budi Owner", "owner@rentivo.test", "Owner");
  await upsertUser("Sari Renter", "renter@rentivo.test", "Renter");

  if ((await Property.countDocuments({ ownerId: owner._id })) === 0) {
    const base = { ownerId: owner._id, ownerName: owner.name, ownerContact: "081234567890" };
    await Property.insertMany([
      { ...base, propertyType: "residential", propertyAdType: "rent", propertyAddress: "Jl. Kemang Raya No. 12, Jakarta Selatan", propertyAmt: 4500000, additionalInfo: "2 kamar tidur, 1 kamar mandi, dekat MRT" },
      { ...base, propertyType: "residential", propertyAdType: "rent", propertyAddress: "Jl. Dago No. 88, Bandung", propertyAmt: 3000000, additionalInfo: "Rumah minimalis, carport, full furnished" },
      { ...base, propertyType: "commercial", propertyAdType: "rent", propertyAddress: "Jl. Pemuda No. 5, Surabaya", propertyAmt: 12000000, additionalInfo: "Ruko 3 lantai di pusat kota" },
      { ...base, propertyType: "land/plot", propertyAdType: "sale", propertyAddress: "Jl. Kaliurang Km 9, Yogyakarta", propertyAmt: 850000000, additionalInfo: "Tanah 300 m2, SHM" },
    ]);
  }

  console.log(`Seed done. Accounts (password ${PASSWORD}): admin@rentivo.test, owner@rentivo.test, renter@rentivo.test`);
  await mongoose.disconnect();
})().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
