import fs from "fs";
console.log(fs.existsSync("../models/CoderData.js") ? "✅ Found" : "❌ Missing");
