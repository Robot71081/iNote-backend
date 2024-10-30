const express = require("express");
const Notes = require("../models/Notes");
const { body, validationResult } = require("express-validator");
const fetchuser = require("../middleware/fetchuser");
const router = express.Router();

//ROUTE1 get all notes login required
router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Notes.find({ user: req.user });
    res.json(notes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("some internal server error occured");
  }
});

//ROUTE1 add notes login required
router.post(
  "/addnote",
  fetchuser,
  [
    body("title").isLength({ min: 3 }),
    body("description").isLength({ min: 5 }),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;
      const result = validationResult(req);
      if (!result.isEmpty()) {
        return res.status(400), json({ errors: errors.array() });
      }
      const note = new Notes({
        title,
        description,
        tag,
        user: req.user,
      });
      const savenote = await note.save();

      res.json(savenote);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("some internal server error occured");
    }
  }
);

//ROUTE3 update notes login required
router.put(
  "/updatenote/:id",
  fetchuser,
  async (req, res) => {
    const {title,description,tag}=req.body;

    try {
        const newNote={};
        if(title){newNote.title=title}
        if(description){newNote.description=description}
        if(tag){newNote.tag=tag}
        let note= await Notes.findById(req.params.id);
        if(!note){
            res.status(404).send("not found")
        }
        if(note.user.toString()!== req.user)
        {
            return res.status(401).send("not allowed")
        }
        note=await Notes.findByIdAndUpdate(req.params.id,{$set:newNote},{new:true})
        res.send({note})
    } catch (error) {
        console.error(error.message);
      res.status(500).send("some internal server error occured");
    }
   


  })


  //ROUTE4 delete notes login required
router.delete(
    "/deletenote/:id",
    fetchuser,
    async (req, res) => {
      const {title,description,tag}=req.body;
      try {
        let note= await Notes.findById(req.params.id);
        if(!note){
            res.status(404).send("not found")
        }
        if(note.user.toString()!== req.user)
        {
            return res.status(401).send("not allowed")
        }
        note=await Notes.findByIdAndDelete(req.params.id)
        res.json({"Success":"note has been delelted",note:note})
      } catch (error) {
        console.error(error.message);
        res.status(500).send("some internal server error occured");
      }
      
     
    
  
  
    })

module.exports = router;
