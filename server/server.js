import express from "express";
const app = express();
const port = 3000;
import cors from "cors";
import { pool } from "./data/post.js";
import bcrypt from "bcrypt";
import session from "express-session";
import moment from "moment";
import nodemailer from "nodemailer";
import dotenv from 'dotenv';

dotenv.config();

let email = [{}];

try {
  const users = await pool.query(
    "SELECT email, full_name FROM users WHERE newsletter"
  );
  email = users.rows;
} catch (err) {
  console.error(err);
}

app.use(cors());
app.use(express.json());
app.use(
  session({
    secret: "SECRET",
    credentials: true,
    name: "sid",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.ENVIRONMENT === "production" ? "true" : "auto",
      httpOnly: true,
      sameSite: process.env.ENVIRONMENT === "production" ? "none" : "lax",
    },
  })
);
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");

app.get(`/${process.env.ROUTE_KEY}`, (req, res) => {
  res.render("admin");
});

// LOGIN
app.post("/auth", async (req, res) => {
  try {
    const { user, pwd } = req.body;
    const userAuth = await pool.query(
      "SELECT id, username, password FROM users WHERE username = $1",
      [user]
    );

    if (userAuth.rowCount > 0) {
      const isSamePass = await bcrypt.compare(pwd, userAuth.rows[0].password);
      if (isSamePass) {
        req.session.user = {
          username: userAuth.rows[0].username,
          id: userAuth.rows[0].id,
        };
        res.json({
          loggedIn: true,
          username: userAuth.rows[0].username,
          id: userAuth.rows[0].id,
        });
      } else {
        res.json({
          loggedIn: false,
          status: "Wrong username or password",
        });
      }
    } else {
      res.json({
        loggedIn: false,
        status: "Wrong username or password",
      });
    }
  } catch (err) {
    console.error(err);
  }
});

app.post("/users", async (req, res) => {
  try {
    const { email, user, pwd } = req.body;
    const hashedPass = await bcrypt.hash(pwd, 10);
    const type = "manual";
    const newsletter = false;
    const newUser = await pool.query(
      "INSERT INTO users(email, username, password, provider, newsletter) VALUES($1, $2, $3, $4, $5) RETURNING *",
      [email, user, hashedPass, type, newsletter]
    );
    res.json(newUser.rows[0]);
  } catch (err) {
    console.error(err);
  }
});

app.get("/users", async (req, res) => {
  try {
    const users = await pool.query("SELECT * FROM users");
    res.json(users.rows);
  } catch (err) {
    console.error(err);
  }
});

app.get("/user/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    res.json(user.rows);
  } catch (err) {
    console.error(err);
  }
});

app.put("/user/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { thumb, email, fullname } = req.body;
    const user = await pool.query(
      "UPDATE users SET thumb=$1, email=$2, full_name=$3 WHERE id = $4",
      [thumb, email, fullname, id]
    );
    res.json(user.rows);
  } catch (err) {
    console.error(err);
  }
});

app.put("/change-pass/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { currentPass, newPass, matchPass } = req.body;
    const userPass = await pool.query(
      "SELECT Password from users WHERE id = $1",
      [id]
    );
    const isSamePass = await bcrypt.compare(
      currentPass,
      userPass.rows[0].password
    );
    console.log(isSamePass);
    if (isSamePass) {
      const hashedPass = await bcrypt.hash(newPass, 10);
      const user = await pool.query(
        "UPDATE users SET password=$1 WHERE id = $2",
        [hashedPass, id]
      );
      res.json(user.rows);
    } else {
      res.json({
        error: true,
        errorType: "Current Password doesn't match",
      });
    }
  } catch (err) {
    console.error(err);
  }
});

app.get("/posts", async (req, res) => {
  try {
    const users = await pool.query("SELECT * FROM posts");
    console.log(users);
    res.json(users.rows);
  } catch (err) {
    console.error(err);
  }
});

app.post("/posts", async (req, res) => {
  try {
    const {
      title,
      postby,
      description,
      author,
      type,
      category,
      thumbimage,
      content,
      reference,
      contentfilelink,
    } = req.body;
    const post = await pool.query(
      "INSERT INTO posts(title, postby, description, author, type, category, thumbimage, content, date, reference, contentfilelink) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)",
      [
        title,
        postby,
        description,
        author,
        type,
        category,
        thumbimage,
        content,
        moment().format(),
        reference,
        contentfilelink,
      ]
    );
    res.json(post.rows);
  } catch (err) {
    console.error(err);
  }
});

app.put("/post/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, author, content, reference } = req.body;
    const user = await pool.query(
      "UPDATE posts SET title=$1, description=$2, author=$3, content=$4, reference=$5 WHERE id = $6",
      [title, description, author, content, reference, id]
    );
    res.json(user.rows);
  } catch (err) {
    console.error(err);
  }
});

app.get("/post/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await pool.query("SELECT * FROM posts WHERE id = $1", [id]);
    const reactCount = await pool.query(
      "SELECT * FROM react WHERE postid= $1",
      [id]
    );
    const commentCount = await pool.query(
      "SELECT * FROM comments WHERE postid= $1",
      [id]
    );
    const updateReact = await pool.query(
      "UPDATE posts SET reactCount = $1 WHERE id= $2 RETURNING *",
      [reactCount.rowCount, id]
    );
    const updateComment = await pool.query(
      "UPDATE posts SET commentCount = $1 WHERE id= $2 RETURNING *",
      [commentCount.rowCount || 0, id]
    );
    res.json(updateReact.rows);
  } catch (err) {
    console.error(err);
  }
});

app.get("/postby/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await pool.query("SELECT * FROM posts WHERE postby = $1", [
      id,
    ]);
    res.json(user.rows);
  } catch (err) {
    console.error(err);
  }
});

app.delete("/post/:postid", async (req, res) => {
  try {
    const { postid } = req.params;
    const response = await pool.query("DELETE FROM posts WHERE id= $1", [
      postid,
    ]);
    res.json(response.rows);
  } catch (err) {
    console.error(err);
  }
});

app.get("/comments", async (req, res) => {
  try {
    const comments = await pool.query("SELECT * FROM comments");
    res.json(comments.rows);
  } catch (err) {
    console.error(err);
  }
});

app.get("/comments/:postid", async (req, res) => {
  try {
    const { postid } = req.params;
    const comments = await pool.query(
      "SELECT c.id, c.postid, c.commentby ,u.full_name as commentByName, c.comment, c.date FROM comments c INNER JOIN users u ON c.commentby = u.id WHERE c.postid = $1 ORDER BY c.date;",
      [postid]
    );
    res.json(comments.rows);
  } catch (err) {
    console.error(err);
  }
});

app.post("/comments/:postid", async (req, res) => {
  try {
    const { postid } = req.params;
    const { commentby, comment, postby } = req.body;
    const sendComment = await pool.query(
      "INSERT INTO comments (postid, commentby, comment, date, postby) VALUES($1, $2, $3, $4, $5) RETURNING *",
      [postid, commentby, comment, moment().format(), postby]
    );
    res.json(sendComment.rows);
  } catch (err) {
    console.error(err);
  }
});

app.delete("/comments/:postid", async (req, res) => {
  try {
    const { id } = req.body;
    const response = await pool.query("DELETE FROM comments WHERE id= $1", [
      id,
    ]);
    res.json(response.rows);
  } catch (err) {
    console.error(err);
  }
});

app.get("/reacts/:postid", async (req, res) => {
  try {
    const { postid } = req.params;
    const reacts = await pool.query(
      "SELECT c.id, c.postid, c.reactby , u.full_name as reactByName FROM react c INNER JOIN users u ON c.reactby = u.id WHERE c.postid = $1",
      [postid]
    );
    res.json(reacts.rows);
  } catch (err) {
    console.error(err);
  }
});

app.post("/reacts/:postid", async (req, res) => {
  try {
    const { postid } = req.params;
    const { reactby } = req.body;
    const sendReact = await pool.query(
      "INSERT INTO react (postid, reactby) VALUES($1, $2) RETURNING *",
      [postid, reactby]
    );
    res.json(sendReact.rows);
  } catch (err) {
    console.error(err);
  }
});

app.delete("/comments/:postid", async (req, res) => {
  try {
    const { id } = req.body;
    const response = await pool.query("DELETE FROM comments WHERE id= $1", [
      id,
    ]);
    res.json(response.rows);
  } catch (err) {
    console.error(err);
  }
});

app.get("/reactby/:postid/:userid", async (req, res) => {
  try {
    const { postid, userid } = req.params;
    const isReact = await pool.query(
      "SELECT * FROM react WHERE postid= $1 and reactby= $2",
      [postid, userid]
    );
    res.json(isReact.rows);
  } catch (err) {
    console.error(err);
  }
});

app.delete("/reactby/:postid/:userid", async (req, res) => {
  try {
    const { postid, userid } = req.params;
    const deleteReact = await pool.query(
      "DELETE FROM react WHERE postid=$1 and reactby=$2",
      [postid, userid]
    );
    res.json(deleteReact.rows);
  } catch (err) {
    console.error(err);
  }
});

app.get("/categories", async (req, res) => {
  try {
    const categories = await pool.query("SELECT * FROM categories");
    res.json(categories.rows);
  } catch (err) {
    console.error(err);
  }
});

app.get("/category/:cat", async (req, res) => {
  try {
    const { cat } = req.params;
    const user = await pool.query(`SELECT * FROM posts WHERE category = $1`, [
      cat,
    ]);
    res.json(user.rows);
  } catch (err) {
    console.error(err);
  }
});

app.get("/types/:type", async (req, res) => {
  try {
    const { type } = req.params;
    const user = await pool.query(`SELECT * FROM posts WHERE type = $1`, [
      type,
    ]);
    res.json(user.rows);
  } catch (err) {
    console.error(err);
  }
});

app.get("/newsletter", async (req, res) => {
  try {
    const { newsletter } = req.params;
    const user = await pool.query(`SELECT id, newsletter FROM users`);
    res.json(user.rows);
  } catch (err) {
    console.error(err);
  }
});

app.put("/newsletter/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await pool.query(
      "UPDATE users SET newsletter = true  WHERE id= $1",
      [id]
    );
    res.json(user.rows);
  } catch (err) {
    console.error(err);
  }
});

app.put("/newsletter/unsubscribe/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await pool.query(
      "UPDATE users SET newsletter = false  WHERE id= $1",
      [id]
    );
    res.json(user.rows);
  } catch (err) {
    console.error(err);
  }
});

app.get("/saved/:postid/:id", async (req, res) => {
  try {
    const { postid, id } = req.params;
    const user = await pool.query(
      "SELECT * FROM saved WHERE postid=$1 and savedby=$2",
      [postid, id]
    );
    res.json(user.rows);
  } catch (err) {
    console.error(err);
  }
});

app.get("/saved", async (req, res) => {
  try {
    const { postid, id } = req.params;
    const user = await pool.query(
      " SELECT * FROM saved s LEFT JOIN posts p ON s.postid = p.id;"
    );
    res.json(user.rows);
  } catch (err) {
    console.error(err);
  }
});

app.post("/saved/:postid/:id", async (req, res) => {
  try {
    const { postid, id } = req.params;
    const user = await pool.query(
      "INSERT INTO saved (postid, savedby) VALUES ($1 , $2)",
      [postid, id]
    );
    res.json(user.rows);
  } catch (err) {
    console.error(err);
  }
});

app.delete("/saved/:postid/:id", async (req, res) => {
  try {
    const { postid, id } = req.params;
    const user = await pool.query(
      "DELETE FROM saved WHERE postid=$1 and savedby=$2",
      [postid, id]
    );
    res.json(user.rows);
  } catch (err) {
    console.error(err);
  }
});

app.get("/newsletterOnWeeknd", async (req, res) => {
  try {
    const users = await pool.query(
      "SELECT email, full_name FROM users WHERE newsletter"
    );
    res.send(users.rows);
  } catch (err) {
    console.error(err);
  }
});

app.post("/newsletterOnWeeknd", (req, res) => {
  let { subject, bodyText } = req.body;
  try {
    email.forEach((element) => {
      sendMail(element.email, element.full_name, subject, bodyText);
    });
    res.send({ success_message: "newsletter has sent successfully" });
  } catch (err) {
    console.error(err);
  }
});

/* MAIL-SYSTEM */
function sendMail(email, name, subject, text) {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL,
      pass: process.env.MAIL_PASS,
    },
  });
  let mailOptions = {
    from: process.env.MAIL,
    to: "me",
    bcc: email,
    subject: subject,
    text: name + "! " + text,
  };
  transporter.sendMail(mailOptions, (err, data) => {
    if (err) {
      return log("Error occurs");
    }
    return log("Email sent!!!");
  });
}

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});

