
const { response } = require("express");
const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");
const { getStorage } = require('firebase-admin/storage');
const credentials = require("./jlsampleproject-firebase-adminsdk-spjvo-13c7ec3190");
const axios = require('axios');
const storage = require('@google-cloud/storage')

admin.initializeApp({
   credential: admin.credential.cert(credentials),
    databaseURL:"https://jlsampleproject-default-rtdb.firebaseio.com/",
    storageBucket: 'jlsampleproject.appspot.com'
});
const db = admin.database();
const bucket = getStorage().bucket();
var addinfo_ref = db.ref('AdditionalInfomation');
var image_ref = db.ref('ImageInfomation');
addinfo_ref.once("value", function(snapshot) {
  console.log(snapshot.val());
});
image_ref.once("value", function(snapshot) {
  console.log(snapshot.val());
});

router.get("/download", async (req, res) => {
  console.log("download==>");
  
  // await storage.bucket(bucketName).file("file.txt").download({destination: './file.txt'});

  // const fileName ="https://firebasestorage.googleapis.com/v0/b/jlsampleproject.appspot.com/o/image1?alt=media&token=c21361f6-8dcd-4ae1-83dc-338f0388c5b2";
  
  const ad = await bucket.file('image1').download({destination: './image1.png'});
  res.download('./image1.png')

  // const ref = bucket.file('image1');
  // const [metadata] = await ref.getMetadata();

  // const token = metadata.metadata.firebaseStorageDownloadTokens;
  // const link = `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/${encodeURIComponent(
  //   'image1'
  // )}?alt=media&token=${token}`
  // res.status(200).send(fileName);

  // console.log("link====>", link)
  // res.send("download response===>", link);
 
});
router.post("/img/", async (req, res) => {

  console.log(req.body);
  const imagePath = req.body.path;
  const tmp_link = req.body.link;
  image_ref.child(imagePath).set({
      link:tmp_link
  })
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  // another common pattern
  // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )

  //try {
  //res.json({
  //  status: 200,
  ///  message: "set data has successfully",
  //});
   // } 
    /*catch (error) {
      console.error(error);
      return res.status(500).send("Server error");
    }*/
  
  /*var fileRef = bucket.file('image1.bmp');
  
  fileRef.exists().then(function(data) {
    console.log("File in database exists ");
  });
  const config = {
    action: 'read',
    
    // A timestamp when this link will expire
    expires: '01-01-2026',
  };
  // Get the link to that file
  fileRef.getSignedUrl(config, function(err, url) {
    if (err) {
      console.error(err);
      return;
    }
    res.send(url)
    console.log("Url is : " + url);  
  });*/

});

router.get("/img", async (req, res) => {
  const path = req.params.path;

  var fileRef = bucket.file('image1.png');
  
  fileRef.exists().then(function(data) {
    console.log("File in database exists ");
  });
  const config = {
    action: 'read',
    
    // A timestamp when this link will expire
    expires: '01-01-2026',
  };
  // Get the link to that file
  fileRef.getSignedUrl(config, function(err, url) {
    if (err) {
      console.error(err);
      return;
    }
    res.send(url)
    console.log("Url is : " + url);  
  });

});
router.get("/test", async (req, res) => {
  try {
    res.json({
      status: 200,
      message: "Get data has successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server error");
  }
});
router.post('/test_store', (req, res) => {
    console.log(req.body);
    const addInfoData ={
        title:req.body.title,
        content:req.body.content
    }
    addinfo_ref.set({
            title: addInfoData.title,
            content: addInfoData.content
    });
    try {
        res.json({
          status: 200,
          message: "set data has successfully",
        });
      } catch (error) {
        console.error(error);
        return res.status(500).send("Server error");
      }
});
/*router.post("/create_account", async (req, res) => {
    console.log(req.body);
    const user ={
        email:req.body.email,
        password:req.body.password
    }
    const userResponse = await admin.auth().createUser({
        email:user.email,
        password:user.password,
        emailVerified:false,
        disabled:false
    })
    res.json(userResponse);
});*/

module.exports = router;
