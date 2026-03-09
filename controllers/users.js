let userModel = require('../schemas/users')
let bcrypt = require('bcrypt');

module.exports = {
    CreateAnUser: async function (username, password, email, role,
        avatarUrl, fullName, status, loginCount
    ) {
        let newUser = new userModel({
            username: username,
            password: password,
            email: email,
            role: role,
            avatarUrl: avatarUrl,
            fullName: fullName,
            status: status,
            loginCount: loginCount
        })
        await newUser.save();
        return newUser;
    },
    QueryByUserNameAndPassword: async function (username, password) {
        let getUser = await userModel.findOne({ username: username });
        if (!getUser) {
            return false;
        }
        let checkPassword = bcrypt.compareSync(password, getUser.password);
        if (!checkPassword) {
            return false;
        }
        return getUser;
    },
    FindUserById: async function (id) {
        return await userModel.findOne({
            _id: id,
            isDeleted:false
        }).populate('role')
    },
    changePassword: async function (id, oldPassword, newPassword) {
        let user = await userModel.findById(id);
        if (!user) throw new Error("User not found");

        let checkPass = bcrypt.compareSync(oldPassword, user.password);
        if (!checkPass) throw new Error("Old password is incorrect");

        user.password = newPassword;
        // Pre-save hook in schema will hash this new password
        await user.save();
        return user;
    }
}