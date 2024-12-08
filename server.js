const http = require("http");
const fs = require("fs");
const path = require("path");
// const { MongoClient } = require("mongodb");

const DATA_FILE = path.join(__dirname, "public", "users.json");
const PUBLIC_DIR = path.join(__dirname, "public");

// const mongoUri = "mongodb://localhost:27017";

// !mongodb connection establishment ==============================
// const dbName = "userManagement";
// const collectionName = "users";

// const client = new MongoClient(mongoUri);
// let db;

// client
//   .connect()
//   .then(() => {
//     db = client.db(dbName); // Store the database connection
//     console.log("Connected to MongoDB");
//   })
//   .catch((err) => {
//     console.error("Error connecting to MongoDB:", err);
//   });

// !================================================================

const server = http.createServer(async (req, res) => {
  if (req.method === "GET") {
    console.log(req.url);
    // Render User Listing Page
    if (req.url === "/") {
      fs.readFile(path.join(PUBLIC_DIR, "index.html"), "utf8", (err, data) => {
        if (err) {
          res.writeHead(500);
          res.end("Error loading page");
        } else {
          res.writeHead(200, { "Content-Type": "text/html" });
          res.end(data);
        }
      });
    } else if (req.url === "/show") {
      console.log("show users route");

      try {
        const fetchMOngodata = async () => {
          const collection = db.collection(collectionName);
          let users = await collection.find({});
          return users;
        };
        const data = await fetchMOngodata();

        const users = await data.toArray();
        if (users.length > 0) {
          let usersListHtml = `
          <html>
        <head>
          <title>User List</title>
        </head>
        <body>
          <h1>User List</h1>

          <ul>
            ${users
              .map(
                (user) => `<li>Name: ${user.name} | Email: ${user.email}</li>`
              )
              .join("")}
          </ul>
          <a href="/">Back to Home</a>
        </body>
      </html>`;

          res.writeHead(200, "content-type", "text/html");
          res.end(usersListHtml);
        }
      } catch (error) {
        console.log("error", error);
      }
      //   if (err) {
      //     res.writeHead(500, { "contente-type": "application/json" });
      //     res.end("error loading users");
      //   } else {

      //     `;
      //     res.writeHead(200, { "Content-Type": "text/html" });
      //     res.end(usersListHtml);
      //   }
      // });
    }

    // !render signup page

    // Render Add User Page
    else if (req.url === "/signup") {
      console.log("signup form");
      fs.readFile(path.join(PUBLIC_DIR, "signup.html"), "utf8", (err, data) => {
        if (err) {
          res.writeHead(500);
          res.end("Error loading page");
        } else {
          res.writeHead(200, { "Content-Type": "text/html" });
          res.end(data);
        }
      });
    }

    // !render user page

    // Get All Users
    else if (req.url === "/style.css") {
      // Correctly serve the CSS file
      const cssFilePath = path.join(__dirname, "public", "style.css");
      fs.readFile(cssFilePath, "utf8", (err, data) => {
        if (err) {
          res.writeHead(500);
          res.end("Error loading CSS file");
        } else {
          res.writeHead(200, { "Content-Type": "text/css" });
          res.end(data);
        }
      });
    } else if (req.url === "/script.js") {
      // Correctly serve the JavaScript file
      const jsFilePath = path.join(__dirname, "public", "script.js");
      fs.readFile(jsFilePath, "utf8", (err, data) => {
        if (err) {
          res.writeHead(500);
          res.end("Error loading JavaScript file");
        } else {
          res.writeHead(200, { "Content-Type": "application/javascript" });
          res.end(data);
        }
      });
    }
  } else if (req.method === "POST") {
    //Add User
    if (req.url === "/signup") {
      console.log("reached signup post request");
      let body = "";
      req.on("data", (chunk) => (body += chunk));
      req.on("end", () => {
        const signupData = JSON.parse(body);
        console.log(signupData, "body data");

        // ? insert data to the mongodb =================================================================

        // const collection = db.collection(collectionName);

        // collection.insertOne(signupData, (err, result) => {
        //   if (err) {
        //     res.writeHead(500, { "Content-Type": "application/json" });
        //     res.end(
        //       JSON.stringify({ error: "Error saving user data to MongoDB" })
        //     );
        //   } else {
        //     console.log("User data saved to MongoDB");
        //     res.writeHead(200, { "Content-Type": "application/json" });
        //     res.end(
        //       JSON.stringify({
        //         message: "User data saved successfully to databse",
        //       })
        //     );
        //   }
        // });

        // ?====================================================================================================

        fs.readFile(DATA_FILE, "utf-8", (err, data) => {
          let users = [];
          if (!err && data) {
            users = JSON.parse(data);
            console.log("parsed user data", users);
          }
          users.push(signupData);

          fs.writeFile(DATA_FILE, JSON.stringify(users, null,2), (err) => {
            if (err) {
              res.writeHead(500, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ error: "Error saving user data" }));
            } else {
              console.log("User data saved successfully");
              res.writeHead(200, { "Content-Type": "application/json" });
              res.end(
                JSON.stringify({ message: "User data saved successfully" })
              );
            }
          });
        });
      });
    }
  }
});

server.listen(9000, () =>
  console.log("Server is running on http://localhost:9000")
);
