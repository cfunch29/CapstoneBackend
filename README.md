# Capstone Project 
This is the backend server for my Finance Tracker called Moolah 💰. 

This server was built using express and mongoDB/mongoose. I implemented JWT and installed a few tools to support (express-validation, bcrypt). 

This server is going to validate users and authorize their data versus what's saved in the database. It will confirm if the name/password/email matches what is already in the database. If not, it will create it. If user already exists it will also validate that. This server connects to the frontend where there will be a registration and login page to which the user will be able to then enter the application and create transactions within the transaction page and see their financial activity in the dashboard page. 

----
[Frontend repo:](https://github.com/cfunch29/CapstoneFrontend.git)

<!-- ROADMAP -->
## Roadmap

** Project Management [Notion](https://www.notion.so/Finance-Tracker-App-MERN-Web-App-313abfec6ae180f3aa4ade4dd935d498?source=copy_link)

-  user schema - backend auth 
-  user routes: POST/GET/PUT/DELETE ("/api/user")
-  auth routes: POST/GET/PUT/DELETE ("/api/auth")
- transaction routes: POST/GET/PUT/DELETE ("/api/transactions")


## Technologies Used 
- JavaScript
- Mongoose 
- bcrypt
- express 
- express-validator 

## Acknowledgements 
- [JWT Integration](https://docs.google.com/document/d/147JxMx1G0yEDM1vzPvo4--fdE11fPJqMsUmeF8i_O4w/edit?tab=t.0)
- [README setup](https://github.com/othneildrew/Best-README-Template/blob/main/README.md?plain=1)

### Reflection 
For future versions, I would include timestamps on the transactions and user schemas. I would also include filter and sort - I started to add it but I didn't want to break the MVP so I didn't finish it. I would include charts and graphs on the dashboard page. 

I would also add more styling/CSS to make more visually appealing!! Inlcude cards/divs to separate each element. 