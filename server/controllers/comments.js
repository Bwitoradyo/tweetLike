//================================================================================
// Get gravatar icon from email ==================================================
//================================================================================
let gravatar = require ('gravatar');
//================================================================================
//Get comments model =============================================================
//================================================================================
let Comments = require ('../models/comments');
//================================================================================
// List comments =================================================================
//================================================================================
exports.list = (req, res) => {
// List all comments and sort by Date ============================================
    Comments.find().sort('-created').populate('user',
        'local.email').exec ((error, comments) => {
        if (error) {
            return res.send(400,{
                message:error
            });
        }
// Render the result =============================================================
        res.render('comments',{
            title:'Comments Page',
            comments: comments,
            gravatar: gravatar.url(comments.email,
                {
                    s:'80',
                    r: 'x',
                    d: 'retro'
                },
                true
            )
        });
    });
};
//Create Comments ================================================================
exports.create = (req, res) => {
//Create a new instance of the Comments model with request body ==================
    let comments = new Comments(req.body);
//Set current user (id) ==========================================================
    comments.user = req.user;
//Save the data received =========================================================
    comments.save((error) => {
       if (error){
           return res.send(400,{
              message: error
           });
       }
//Redirect to comments ===========================================================
        res.redirect('/comments');
    });
};

//================================================================================
// Comments authorization middleware =============================================
//================================================================================
exports.hasAuthorization = (req, res, next) => {
  if (req.isAuthenticated())
      return next();
  res.redirect('/login');
};