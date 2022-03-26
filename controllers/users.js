const User = require('../models/user');

//Render Register form
module.exports.renderRegistration = (req, res) =>{
	res.render('users/register');
};

//Register
module.exports.register =  async(req, res, next)=>{
	try{
		const{email, username, password} = req.body;
		const user = new User({email, username});
		const registeredUser = await User.register(user, password);
		req.login(registeredUser, err=>{
			if(err) return next(err);
			req.flash('success', 'Welcome to Yelpark!');
			res.redirect('/parks');
		});
	}catch(e){
		req.flash('error', e.message);
		res.redirect('/parks');
	}

};

//Render Login form
module.exports.renderLogin = (req, res) =>{
	res.render('users/login');
}

//Login
module.exports.login = (req, res) =>{
	req.flash('success', 'Welcome back!');
	const redirectRoute = req.session.returnTo || '/parks';
	res.redirect(redirectRoute);
}

//Logout
module.exports.logout = (req, res) =>{
	req.logout();
	req.flash('success', 'You\'re logged out!');
	res.redirect('/parks');
}