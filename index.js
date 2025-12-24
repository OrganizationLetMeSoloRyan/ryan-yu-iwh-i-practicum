const express = require("express");
const axios = require("axios");
const app = express();
require("dotenv").config();

app.set("view engine", "pug");
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));

const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS_TOKEN;

// 1. Homepage: List Companies
app.get("/", async (req, res) => {
  const companiesUrl =
    "https://api.hubapi.com/crm/v3/objects/companies?properties=name,domain,description";
  const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    "Content-Type": "application/json",
  };

  try {
    const resp = await axios.get(companiesUrl, { headers });
    const data = resp.data.results;
    res.render("homepage", { title: "Companies | HubSpot Practicum", data });
  } catch (error) {
    console.error(error);
  }
});

// 2. GET: Form to add Company
app.get("/update-cobj", (req, res) => {
  res.render("updates", { title: "Update Company | HubSpot Practicum" });
});

// 3. POST: Create Company
app.post("/update-cobj", async (req, res) => {
  const newCompany = {
    properties: {
      name: req.body.name,
      domain: req.body.domain,
      description: req.body.description,
    },
  };

  const createUrl = "https://api.hubapi.com/crm/v3/objects/companies";
  const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    "Content-Type": "application/json",
  };

  try {
    await axios.post(createUrl, newCompany, { headers });
    res.redirect("/");
  } catch (err) {
    console.error(err);
  }
});

app.listen(3000, () => console.log("Listening on http://localhost:3000"));
