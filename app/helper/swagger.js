const swaggerJsdoc=require('swagger-jsdoc');
const swaggerui=require('swagger-ui-express');

const options={
    definition:{
        openapi:'3.0.0',
        info:{
            title:'wealth management API',
            version:"1.0.0",
            description:'API documentation for Placerly wealthwise management website backend',
            contact:{
                name:"Tanmay Karmakar",
                email:"karmakartanmay08@gmail.com",
            },
        },
        servers:[
            {url:'http://localhost:7000',description:'Development server',},
        ],
    },
    apis: ["./app/routes/**/*.js"],
}

const swaggerSpec=swaggerJsdoc(options);
module.exports={swaggerui,swaggerSpec};