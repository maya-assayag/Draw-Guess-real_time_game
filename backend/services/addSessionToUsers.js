const { User } = require("../models/user");

async function addSessionToUsers(score, session) {
  let user;
  for (let userId of session.participants) {
    user = await User.findById(userId.toString());
    if (user) {
      user.sessions.add({ score, session });
      await user.save();
    }
  }
}

module.exports = addSessionToUsers;
