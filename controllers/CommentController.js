import CommentModel from '../models/Comment.js'
import PostModel from '../models/Post.js'

export const getLastComment = async (req, res) =>{
  try{
    const comments = await CommentModel.find().limit(3).exec();
    
    // const tags = posts.map(obj =>  obj.tags).flat().slice(0,5);

    res.json(comments);
} catch (err) {
  console.log(err);
    res.status(500).json({ 
      message: 'Не удалось найти коментарии!',
    });
}
};

export const getAll = async (req, res) => {
  try{
      const comments = await CommentModel.find().populate('user').exec();
      res.json(comments);
  } catch (err) {
    console.log(err);
      res.status(500).json({
        message: 'Не удалось найти коментарии!',
      });
  }
};

export const getCommentsOnePosts = async (req, res) => {
  try{
    const postId = await PostModel.find({id: req.body._id});

    const comments = await CommentModel.find().limit(3).exec();
    
    // const tags = posts.map(obj =>  obj.tags).flat().slice(0,5);

    res.json(comments);
} catch (err) {
  console.log(err);
    res.status(500).json({ 
      message: 'Не удалось найти коментарии!',
    });
  }
};

export const remove = async (req, res) => {
  try{
      const postId = req.params.id;
      CommentModel.findByIdAndRemove({
        _id: postId,
      }, (err, doc) => {
        if (err){
          console.log(err);
          return res.status(500).json({
            message: 'Не удалось удалить статью!',
          });
        }

        if (!doc){
          console.log(err);
          return res.status(404).json({
            message: 'Не удалось найти статью!',
          });
        }

        res.json({
          success: true
        })

      });

  } catch (err) {
    console.log(err);
      res.status(500).json({
        message: 'Не удалось найти статьи!',
      });
  }
};

export const create = async (req, res) => {
    try {

      const postId = await PostModel.findOne({id: req.body._id});

      const doc = new CommentModel({
        text: req.body.text,
        user: req.userId,
        post: postId,
      });
  
      const comment = await doc.save();
  
      res.json(comment);

    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: 'Не удалось создать коментарий!',
      });
    }
  };

export const update = async (req, res) => {
    try { 
      const commentId = req.params.id;

      await CommentModel.updateOne({
        _id: commentId,
      },{
        text: req.body.text,
        user: req.userId,
        post: req._id,
      });

      res.json({
        success: true,
      });
    }
    catch (err) {
      console.log(err);
      return res.status(500).json({
        message: 'Не удалось обновить комментарий!',
      });
    }
};