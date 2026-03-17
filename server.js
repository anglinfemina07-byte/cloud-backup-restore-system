
const express = require("express");
const multer = require("multer");
const AWS = require("aws-sdk");
const cors = require("cors");

const app = express();

app.use(cors());

const upload = multer({ storage: multer.memoryStorage() });

// AWS configuration
AWS.config.update({
region: "eu-north-1",
accessKeyId: "MY-ACCESS-ID",
secretAccessKey: "MY-SECRET-KEY"
});

const s3 = new AWS.S3();


// BACKUP ROUTE
app.post("/backup", upload.single("file"), (req,res)=>{

const params = {
Bucket: "angelin-backup-storage",
Key: req.file.originalname,
Body: req.file.buffer
};

s3.upload(params,(err,data)=>{

if(err){
console.log(err);
res.send("Backup Failed");
}
else{
res.send("Backup Successful");
}

});

});


// RESTORE ROUTE
app.get("/restore/:filename",(req,res)=>{

const params = {
Bucket: "angelin-backup-storage",
Key: req.params.filename
};

const fileStream = s3.getObject(params).createReadStream();

fileStream.pipe(res);

});


// SERVER START
app.listen(3000,()=>{
console.log("Cloud Backup Server Running on Port 3000");
});