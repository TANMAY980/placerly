const express = require('express');
const router = express.Router();
const userController = require('../../modules/webservice/user.controller');
const imageupload=require('../../helper/cloudinary.fileupload')

/**
 * @swagger
 * /api/upload/{id}:
 *   post:
 *     summary: Upload a user image
 *     description: Uploads a profile image for a specific user by ID. Supports jpg, jpeg, png, webp, pdf, and csv files.
 *     tags:
 *       - upload image
 *     parameters:
 *       - name: id
 *         in: path
 *         description: User ID of the account whose password needs to be updated.
 *         required: true
 *         schema:
 *           type: string
 *           example: 69090a66c24058fc9508b7e7
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Image file to upload
 *     responses:
 *       200:
 *         description: Image uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Image uploaded successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     imageUrl:
 *                       type: string
 *                       example: https://res.cloudinary.com/demo/image/upload/v1690000000/user/profile%20image/profile.jpg
 *       400:
 *         description: Invalid request or file type
 *       500:
 *         description: Internal server error
 */
router.post("/upload/:id",imageupload.uploadUserfile('image'),userController.upload_Image);

/**
 * @swagger
 * /api/getdetails/{id}:
 *   get:
 *     summary: Get user details by ID
 *     description: Fetch specific user details (only selected fields) using the user's unique ID.
 *     tags:
 *       - Fetch User Profile Details
 *     parameters:
 *       - name: id
 *         in: path
 *         description: User ID of the account whose password needs to be updated.
 *         required: true
 *         schema:
 *           type: string
 *           example: 69090a66c24058fc9508b7e7
 *     responses:
 *       200:
 *         description: Successfully retrieved user details.
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
 *                   example: User details fetched successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: "Tanmay Karmakar"
 *                     email:
 *                       type: string
 *                       example: "tanmay@gmail.com"
 *                     image:
 *                       type: string
 *                       example: "https://res.cloudinary.com/demo/image/upload/v12345/profile.jpg"
 *       400:
 *         description: Invalid user ID provided.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
 */
router.get("/getdetails/:id",userController.fetch_details);

module.exports=router;