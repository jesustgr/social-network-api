const router = require('express').Router();
const { User, Thought } = require("../../models");

router.get('/', async (req,res)=>{
    try{
        const allThoughts = await Thought.find({});
        res.json(allThoughts);
    }
    catch (error){
        res.status(500).json(error);
    }
});

router.get('/:id', async (req,res)=>{
    try{
        const thought = await Thought.findOne({
            _id: req.params.id
        })      
        .select("-__v");

        if (!thought){
            res.status(500).json({message: "no thought found"})
        }

        res.json(thought);
    }
    catch (error){
        res.status(500).json(error);
    }
});

router.post('/', async (req,res)=>{
    try{
        const newThought = await Thought.create(req.body);
        const updatedUser = await User.findOneAndUpdate(
            {_id: req.body.userId},
            { $push: { thoughts: newThought._id}},
            {new: true});
        
        if (!updatedUser){
            res.status(400).json({message: "no user found :/ (make sure there is a userId in the req.body"});
        }
        res.json(newThought);
    }
    catch (error){
        res.status(500).json(error);
    }
});

router.put('/:id', async (req,res)=>{
    try{
        const foundThought = await Thought.findOneAndUpdate(
            {_id: req.params.id},
            { $set: req.body },
            { runValidators: true, New: true }
        );
        console.log(foundThought);
        res.json(foundThought);
    }
    catch (error){
        res.status(500).json(error);
    }
})

router.delete('/:id', async (req,res)=>{
    try{
        const deletedThought = await Thought.findOneAndDelete(
            {_id: req.params.id},
        )
        const updatedUser = await User.findOneAndUpdate(
            { thoughts: req.params.id},
            { $pull: {thoughts: req.params.id}},
            {new: true}
        )
        
        if (!updatedUser){
            res.status(400).json({message: "thought deleted, however no user found :/"});
        }
        res.status(200).json({message: "thought successfully deleted"});
    }
    catch (error){
        res.status(500).json(error);
    }
});

router.post('/:id/reactions', async (req,res)=>{
    try{
        const updatedThought = await Thought.findOneAndUpdate(
            {_id: req.params.id},
            { $addToSet: {reactions: req.body}},
            {runValidators: true, new: true}
        );

        if (!updatedThought){
            res.status(400).json({message: "No thought found :/"})
        }

        res.status(200).json(updatedThought);
    }
    catch(error){
        res.status(500).json(error);
    }
})

router.delete('/:thoughtId/reactions/:reactionId', async (req,res)=>{
    try{
        const updatedThought = await Thought.findOneAndUpdate(
            {_id: req.params.thoughtId},
            { $pull: {reactions: {reactionId: req.params.reactionId}}},
            {runValidators: true, new: true}
        );

        if (!updatedThought){
            res.status(400).json({message: "No thought found :/"})
        }

        res.status(200).json(updatedThought);
    }
    catch(error){
        res.status(500).json(error);
    }
})

module.exports = router;