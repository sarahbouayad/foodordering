module.exports = function(app, passport, db) {

// normal routes ===============================================================

    // show the home page (will also have our login links)
    app.get('/', function(req, res) {
        res.render('index.ejs');
    });

    // PROFILE SECTION =========================
    app.get('/profile', isLoggedIn, function(req, res) {
        db.collection('ingredients').find({name: req.user.local.email}).toArray((err, result) => {
          console.log(result)
          if (err) return console.log(err)
        
          // do it for the other cities
       
          res.render('profile.ejs', {
            user : req.user,
            ingredients: result
          })
        })
    });

    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout(() => {
          console.log('User has logged out!')
        });
        res.redirect('/');
    });

// message board routes ===============================================================

    app.post('/messages', (req, res) => {
      console.log(req.body.dropDown)
      db.collection('ingredients').insertOne(
        {
        name: req.body.name,
        address: req.body.address, 
        phoneNumber: req.body.phoneNumber, 
        dropDown: req.body.dropDown,
        sauceList: req.body.sauceList,
        meatList: req.body.meatList,
        cheeseList: req.body.cheeseList,
        veggieList: req.body.veggieList,
        square: false,
      },
    (err, result) => {
        if (err) return console.log(err)
        console.log('saved to database')
        res.redirect('/profile');
      });
    })

    // 11/4, 1:21PM, tested logic below. 
    // green checkbox tested and it does not return false when clicked after it returns true. (you can't uncheck)

    app.put('/squareCheck', (req, res) => {
      console.log(req.body)
      db.collection('ingredients').findOneAndUpdate(
        {
          name: req.user.local.email
        },

        {
          // $set explanation
        $set: {
          square: !req.body.square,
        },
      }, 
      {
        sort: {_id: -1},
        upsert: true
      }, 
      (err, result) => {
        if (err) return res.send(err)
        res.send(result)
      }
    )
  })




    app.delete('/trashApi', (req, res) => {
      db.collection('ingredients').findOneAndDelete({
        name: req.user.local.email
      }, 
      {
        // $set explanation
      $set: {
        veggieList: [],
        cheeseList: [],
        meatList: [], 
      },
    }, 

        (err, result) => {
        if (err) return res.send(500, err)
        console.log('deleted')
        res.send('Message deleted!')

        // [] overwrite using the $set pass an array 
      })
    })

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // locally --------------------------------
        // LOGIN ===============================
        // show the login form
        app.get('/login', function(req, res) {
            res.render('login.ejs', { message: req.flash('loginMessage') });
        });

        // process the login form
        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

        // SIGNUP =================================
        // show the signup form
        app.get('/signup', function(req, res) {
            res.render('signup.ejs', { message: req.flash('signupMessage') });
        });

        // process the signup form
        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
