const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (req, res) => {
    const users = await User.find({}).populate('blogs', { title: 1});
    res.json(users)
})

usersRouter.post('/', async (req, res, next) => {
    const { username, name, password } = req.body
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    if(username.length < 4 || password.length <4)
    {
        res.status(400).json({error: "Min length username and password is 3"}).end()
        next("Min length username and password is 3")
    }
    else
    {
        const user = new User({
            username,
            name,
            passwordHash
        })
    
        const savedUser = await user.save()
    
        res.status(201).json(savedUser).end()
    }

})

module.exports = usersRouter