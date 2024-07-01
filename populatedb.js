#! /usr/bin/env node

// Load environment variables
require('dotenv').config();

const moment = require('moment'); // Currently unused, consider removing if not needed
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const Book = require("./models/book.js");
const Author = require("./models/author.js");
const books = [];
const authors = [];

// Use the MongoDB URI from environment variables
const mongoDB = process.env.MONGODB_URI;

main().catch((err) => console.log(err));

async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect(mongoDB);
  console.log("Debug: Should be connected?");
  await createAuthors();
  await createBooks();
  console.log("Debug: Closing mongoose");
  mongoose.connection.close();
}

async function authorCreate(index, first_name, family_name, d_birth, d_death) {
  const authordetail = { firstName: first_name, lastName: family_name };
  if (d_birth != false) authordetail.dateOfBirth = d_birth;
  if (d_death != false) authordetail.dateOfDeath = d_death;

  const author = new Author(authordetail);
  await author.save();
  authors[index] = author;
  console.log(`Added author: ${first_name} ${family_name}`);
}

async function bookCreate(index, title, summary, isbn, author) {
  const bookdetail = {
    title: title,
    summary: summary,
    author: author,
    isbn: isbn,
  };

  const book = new Book(bookdetail);
  await book.save();
  books[index] = book;
  console.log(`Added book: ${title}`);
}

async function createAuthors() {
  console.log("Adding authors");
  await Promise.all([
    authorCreate(0, "Patrick", "Rothfuss", "1973-06-06", false),
    authorCreate(1, "Ben", "Bova", "1932-11-8", false),
    authorCreate(2, "Isaac", "Asimov", "1920-01-02", "1992-04-06"),
    authorCreate(3, "Bob", "Billings", false, false),
    authorCreate(4, "Jim", "Jones", "1971-12-16", false),
  ]);
}

async function createBooks() {
  console.log("Adding Books");
  await Promise.all([
    bookCreate(0,
      "The Name of the Wind (The Kingkiller Chronicle, #1)",
      "I have stolen princesses back from sleeping barrow kings. I burned down the town of Trebon. I have spent the night with Felurian and left with both my sanity and my life. I was expelled from the University at a younger age than most people are allowed in. I tread paths by moonlight that others fear to speak of during day. I have talked to Gods, loved women, and written songs that make the minstrels weep.",
      "9781473211896",
      authors[0]
    ),
    // Add additional book creates as necessary
  ]);
}