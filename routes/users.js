const {User} = require('../models/user');
const express = require('express');
const { Category } = require('../models/category');
const  bcrypt = require('bcryptjs')
const  jwt = require('jsonwebtoken')
const router = express.Router();

router.get(`/`, async (req, res) =>{
    const userList = await User.find().select('-passwordHash');

    if(!userList) {
        res.status(500).json({success: false})
    } 
    res.send(userList);
})

router.get('/:id', async (req, res) => {
    // if you want to ignore passwordHash
    const user = await User.findById(req.params.id).select('-passwordHash');

    // if you want to select just 2 column
    //const user = await User.findById(req.params.id).select('name email');
    if (!user) {
        res.status(500).json({ message: 'use not found' });
    }
    res.status(200).send(user);
});

router.post('/', async (req, res) => {
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.password, 10),
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        street: req.body.street,
        apartment: req.body.apartment,
        zip: req.body.zip,
        city: req.body.city,
        country: req.body.country,
    });

    user = await user.save();
    if (!user) {
        return res.status(404).send('User cannot be created');
    }
    res.send(user);
});

router.put('/:id', async (req, res) => {

    const userExited = await User.findById(req.params.id);

    let newPassword;
    if (req.body.password) {
        newPassword = bcrypt.hashSync(req.body.password, 10);
    }
    else  {
        newPassword = userExited.password;
    }
    const user = await User.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        street: req.body.street,
        apartment: req.body.apartment,
        passwordHash: newPassword,
        zip: req.body.zip,
        city: req.body.city,
        country: req.body.country,
    }, {new: true});
    if (!user) {
        return res.status(400).send('User cannot be updated');
    }
    res.send(user);

});

router.post('/login', async (req, res)=> {
    const user = await User.findOne({email: req.body.email})
    if (!user) {
        return res.status(400).send('The User not found');
    }
    const secret = process.env.SECRET;

    if (user && bcrypt.compareSync(req.body.password, user.passwordHash )) {
        const token = jwt.sign(
          {
              userId: user.id,
              isAdmin: user.isAdmin
          },
          secret,
          { expiresIn: '1d' }
        )
        res.status(200).send({user: user.email, token: token});
    }
    else {
        res.status(400).send('password is wrong');
    }
})

router.get('/get/count', async (req, res) => {
    const userCount = await User.countDocuments();
    if (!userCount) {
        res.status(500).json({ success: false });
    }
    res.send({
        userCount: userCount
    });
});

router.delete('/:id', (req, res) => {
    User.findByIdAndDelete(req.params.id).then(user => {
        if (user) {
            return res.status(200).json({ success: true, message: 'deleted!' });
        } else {
            return res.status(404).json({ success: false, message: 'user not found!' });
        }
    }).catch(err => {
        return res.status(400).json({ success: false, err: err });
    });
});

module.exports =router;
