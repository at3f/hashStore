const router = require('express').Router()
const cUser = require('../controllers/cUser')
const jtoken = require('../controllers/JWT')
const jADMINtoken = require('../controllers/ADMINJWT')
const check = require('express-validator').check


router.post('/user/register',
                            check('email').isEmail().isLength({min:10,max:40}),
                            check('userName').custom(v=>{
                                    for (let i = 0; i < v.length; i++) {
                                        if(v[i]===" ") return false
                                    }
                                    return true
                            }).isLength({min:4,max:16}),
                            check('phone').isMobilePhone(),
                            check('password').isLength({min:8,max:32})
                            ,cUser.postRegister)

router.post('/user/FFactorAuth',
                            check('userName').custom(v=>{
                                for (let i = 0; i < v.length; i++) {
                                    if(v[i]===" ") return false
                                }
                                return true
                            }).isLength({min:4,max:16}),
                            check('password').isLength({min:8,max:32}),
                                cUser.isUser,cUser.sendOTP)

router.post('/user/TwoFactorAuth',cUser.Userlogin)
router.post('/user/logout',cUser.postLogout)
router.post('/user/getNewAccessToken',cUser.getNewAccessToken)
router.put('/user/updatePassword',
                            check('newPassword').isLength({min:8,max:32})
                            ,jtoken.authorize,cUser.UpdatePassword)

router.delete('/user/deleteAccount',jtoken.authorize,cUser.deleteUser,cUser.postLogout)
router.get('/user/getUserData',jtoken.authorize,cUser.getUserData)

router.get('/admin/getUserData/:id',jADMINtoken.authorize,cUser.getUserDataForAdmin)


router.post('/user/forgetPassword',
                            check('email').isEmail().isLength({min:10,max:40}),
                            cUser.sendCode)
router.post('/user/verifyCode',
                            check('email').isEmail().isLength({min:10,max:40}),
                            cUser.verifyCode)
router.post('/user/resetPassword',
                            check('newPassword').isLength({min:8,max:32})
                            ,jtoken.verifyToken,cUser.resetPassword)

// router.post('/user/sendVerificationMail',jtoken.authorize,cUser.sendVerificationMail)
// router.get('/user/VerificationMail/:id/:code',cUser.VerificationMail)

router.get('/admin/getUsers',jADMINtoken.authorize,cUser.getAllUsers) //Admin

router.get('/testAuth',jtoken.authorize,async (req,res)=>{
    res.send("SUCCESS")
})

module.exports = router