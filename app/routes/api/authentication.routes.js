const express = require('express');
const router = express.Router();
const auth=require('../../middleware/auth')
const authcontroller=require('../../modules/webservice/auth.controller')

/**
 * @swagger
 * /api/register:
 *   post:
 *     summary: Register a new user
 *     tags: [register user]
 *     description: Creates a new user account with firstName,lastName,email,contactNumber,desiredPassword,confirmPassword with terms and condition.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - contactNumber
 *               - email
 *               - terms_conditon
 *               - desiredPassword
 *               - confirmPassword
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: Tanmay
 *               lastName:
 *                  type: string
 *                  example: Karmakar
 *               contactNumber:
 *                  type: string
 *                  example: "7001909836"
 *               email:
 *                 type: string
 *                 example: tanmaykarmakar08@gmail.com
 *               terms_conditon: 
 *                 type: boolean
 *                 example: "true"
 *               desiredPassword:
 *                  type: string
 *                  example: Aa$qwewd3sds123
 *               confirmPassword:
 *                 type: string
 *                 example: Aa$qwewd3sds123
 *     responses:
 *       201:
 *         description: User registered successfully
 *       500:
 *         description: Invalid input data
 */
router.post('/register', authcontroller.user_registration);


/** 
 * @swagger
 * /api/login:
 *   post:
 *     summary: User login
 *     description: Logs in a user with email and password. Returns access and refresh tokens upon successful authentication.
 *     tags:
 *       - user login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: karmakartanmay08@gmail.com
 *               password:
 *                 type: string
 *                 example: Aa$qwewd3sds123
 *     responses:
 *       200:
 *         description: User successfully logged in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Login successful
 *                 accessToken:
 *                   type: string
 *                   description: JWT access token
 *                 refreshToken:
 *                   type: string
 *                   description: JWT refresh token
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 64f8b1e7e12d3b21a4e0a3f9
 *                     email:
 *                       type: string
 *                       example: user@example.com
 *                     role:
 *                       type: string
 *                       example: user
 *       400:
 *         description: Invalid credentials or input validation failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Password didn't match, please try again
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */
router.post('/login',authcontroller.user_login);

/**
 * @swagger
 * /api/verifyemail:
 *   post:
 *     summary: Verify user email with OTP
 *     description: Verifies a user's email address using the OTP sent to their registered email. If OTP is valid and not expired, user will be marked as verified.
 *     tags:
 *       - verify Email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - otp
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: karmakartanmay08@gmail.com
 *               otp:
 *                 type: string
 *                 example: "7475"
 *     responses:
 *       200:
 *         description: Email verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: User email verified successfully
 *       400:
 *         description: Missing or invalid data (email or OTP)
 *       404:
 *         description: User not found or OTP invalid/expired
 *       500:
 *         description: Internal server error
 */
router.post("/verifyemail",authcontroller.verify_email)

/**
 * @swagger
 * /api/updatepassword/{id}:
 *   post:
 *     summary: Update user password
 *     description: Allows an authenticated user to update their password using their access token.
 *     tags:
 *       - Update Password
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: User ID of the account whose password needs to be updated.
 *         required: true
 *         schema:
 *           type: string
 *           example: 67123abc9d12f45e321bc001
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *             properties:
 *               password:
 *                 type: string
 *                 description: The new password for the user.
 *                 example: "Tanmay@123m"
 *     responses:
 *       200:
 *         description: Password updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Password updated successfully"
 *       400:
 *         description: Bad request (missing or invalid password).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Check your password and enter again"
 *       401:
 *         description: Unauthorized - Missing or invalid access token.
 *       500:
 *         description: Internal server error.
 */

router.post("/updatepassword/:id",auth.jwtauth,authcontroller.update_password)

module.exports = router;
