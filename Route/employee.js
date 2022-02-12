//*-------------------- Router Level Middleware-----------------------
// it provides a router interface
const { Router } = require("express");
const router = Router();
const multer = require("multer");

//* Importing the Schema Model
const EMPLOYEE_SCHEMA = require("../Model/Employee.js");

// * Importing the HELPER MODULE
const { ensureAuthenticated } = require("../helper/auth_helper");

//!======load the multer starts======
const { storage } = require("../middlewares/multer.js");
const upload = multer({ storage: storage });
//!======load the multer ends======

// ======================GET METHOD STARTS=================

/* @HTTP GET METHOD
   @ACCESS PUBLIC 
   @URL /employee/home
   */
router.get("/home", async (req, res) => {
  let payload = await EMPLOYEE_SCHEMA.find({}).lean();
  res.render("../views/home", { title: "Home Page", payload });
});

//!==========Adding authentication for emp-profile===========
/* @HTTP GET METHOD
   @ACCESS PUBLIC 
   @URL /employee/emp-profile
   */

router.get("/emp-profile", ensureAuthenticated, async (req, res) => {
  let payload = await EMPLOYEE_SCHEMA.find({
    user: req.params.id,
  }).lean();

  res.render("../views/employees/emp-profile",{title: "Home Page", payload});
});

/* @HTTP GET METHOD
   @ACCESS PUBLIC 
   @URL /employee/create-emp
   */
router.get("/create-emp", ensureAuthenticated,(req, res) => {
  res.render("../views/employees/create-emp", {
    title: "Create Employee Page",
  });
});

//!================To Fetch Data from MongoDB Database=======
/*
@HTTP GET METHOD
   @ACCESS PUBLIC 
   @URL /employee/emp-profile
*/

router.get("/:id", async (req, res) => {
  let payload = await EMPLOYEE_SCHEMA.findOne({ _id: req.params.id }).lean();
  res.render("../views/employees/employeeProfile", { payload });
  console.log(payload);
});

//!================To Fetch Data from MongoDB Database=======

//!======================TO EDIT the DATA=======================
router.get("/edit-emp/:id", ensureAuthenticated,async (req, res) => {
  let editPayload = await EMPLOYEE_SCHEMA.findOne({
    _id: req.params.id,
  }).lean();

  res.render("../views/employees/editEmp", { editPayload });
  console.log(editPayload);
});

//!================TO EDIT the DATA==============================

/*====================END ALL GET METHODS===================== */

/*====================POST METHODS STARTS======================= */
/* METHOD POST
   @ACCESS PRIVATE 
   @URL /employee/create-emp
   */

//  using multer to file upload
router.post("/create-emp", ensureAuthenticated,upload.single("emp_photo"), async (req, res) => {
  //*==============to check the post request===============================
  // let data = await req.body;
  // console.log(data);

  //!for multerr i changed
  // console.log(req.body);
  // console.log(req.file);

  //*================to check the post request ============================

  // !Code Starts for POST request Logic
  //!destructuring the req.body from the post request
  let {
    emp_id,
    emp_name,
    emp_salary,
    emp_education,
    emp_experience,
    emp_location,
    emp_designation,
    emp_email,
    emp_phone,
    emp_skills,
    emp_gender,
  } = req.body;

  let payload = {
    emp_photo: req.file,
    emp_id,
    emp_name,
    emp_salary,
    emp_education,
    emp_experience,
    emp_location,
    emp_designation,
    emp_email,
    emp_phone,
    emp_skills,
    emp_gender,
  };

  //!=== Now to save All the DATA into DATABASE=======

  let body = await EMPLOYEE_SCHEMA.create(payload);
  req.flash("SUCCESS_MESSAGE", "successfully employee created..");
  res.redirect("/employee/home", 302, { body });
  //!===to save All the DATA into DATABASE=======
});

/*====================END ALL POST METHODS======================= */

/*==================ALL PUT METHODS STARTS=================== */

//! Remember: Method-override should be used
router.put("/edit-emp/:id", upload.single("emp_photo"), (req, res) => {
  EMPLOYEE_SCHEMA.findOne({ _id: req.params.id })
    .then(editEmp => {
      //old  values            new values
      (editEmp.emp_photo = req.file),
        (editEmp.emp_id = req.body.emp_id),
        (editEmp.emp_name = req.body.emp_name),
        (editEmp.emp_salary = req.body.emp_salary),
        (editEmp.emp_education = req.body.emp_education),
        (editEmp.emp_experience = req.body.emp_experience),
        (editEmp.emp_email = req.body.emp_email),
        (editEmp.emp_phone = req.body.emp_phone),
        (editEmp.emp_gender = req.body.emp_gender),
        (editEmp.emp_designation = req.body.emp_designation),
        (editEmp.emp_skills = req.body.emp_skills),
        (editEmp.emp_location = req.body.emp_location);

      //update data in database
      editEmp.save().then(_ => {
        req.flash("SUCCESS_MESSAGE", "successfully data updated..");
        res.redirect("/employee/home", 302, {});
      });
    })
    .catch(err => {
      console.log(err);
    });
});

/*==================ALL PUT METHODS ENDS=================== */

/*==================ALL DELETE METHODS STARTS================= */
//! Remember: Method-override should be used

router.delete("/delete-emp/:id", async (req, res) => {
  await EMPLOYEE_SCHEMA.deleteOne({ _id: req.params.id });
  req.flash("SUCCESS_MESSAGE", "successfully Data deleted..");
  res.redirect("/employee/home", 302, {});
});

/*==================ALL DELETE METHODS ENDS=================== */

module.exports = router;
