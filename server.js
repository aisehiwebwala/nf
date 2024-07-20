const express = require("express");
const multer = require("multer");
const fs = require("fs");
const upload = multer();
const app = express();
const port = 3000;

app.use(express.json());
app.use("/public",express.static(__dirname+"/dist"));

app.get("/file/:fn",(req,res)=>{
  fs.createReadStream("/tmp/"+req.params.fn).pipe(res);
})
app.get("/upload-file", (req, res) => {
  res.sendFile(__dirname+"/dist/index.html");
});

app.get("/files",async(req,res)=>{
    const list = fs.readdirSync("/tmp",{withFileTypes:true});
    let html = "";
    for(let file of list){
      html+=`<a style="display:block;margin:5px;" href="/file/${file.name}" target="_blank"> ${file.name} </a>`
    }
    res.send(html);
})

app.post("/upload-file", upload.single("phile"), async (req, res) => {
  try {
    const file_info = JSON.parse(req.body.file_info);
    
    if(file_info.is_first && fs.existsSync("/tmp/"+file_info.file_name)){
      fs.rmSync("/tmp/"+file_info.file_name);
    }

    const file = req.file;
    fs.appendFileSync("/tmp/" + file_info.file_name, file.buffer);
    if(file_info.is_last) return res.redirect("/upload-file");
    res.status(200).send("OK");

  } catch (error) {
    console.log(error);
    res.json(error);
  }
});

app.get("/", (req, res) => res.send("Hello World!"));
app.listen(port, () => console.log(`Example app listening on port ${port}!`))
