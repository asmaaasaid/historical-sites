
//when signup he will show the id, name and email
exports.sanitizeUser = function(user) {
    return {
      _id: user._id,
      name: user.name,
      email: user.email
    };
  };