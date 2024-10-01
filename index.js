const express = require("express");
const cors = require("cors");
const axios = require("axios");
const path = require("path");
const useragent = require("express-useragent"); // Import express-useragent

const app = express();
const PORT = 3000;
const API_KEY = process.env.IPGEOLOCATION;

// Middleware to parse user-agent
app.use(useragent.express());

app.use(cors());

// Middleware to parse JSON requests
app.use(express.json());

// Serve static HTML files (like index.html from public folder)
app.use(express.static(path.join(__dirname, "public")));

// API route to get geolocation and device info
app.get("/get-geolocation", async (req, res) => {
  // Get the IP from the query params or fallback to default (optional)
  const ip = req.query.ip || "";

  // Get user-agent information from the request
  const ua = req.useragent;
  console.log("User-Agent:", req.headers["user-agent"]); // Log the user-agent string
  const device = ua.isMobile ? "Mobile" : ua.isTablet ? "Tablet" : "Desktop";
  const os = ua.os;

  try {
    // Send request to ipgeolocation.io to get geolocation data
    const response = await axios.get(`https://api.ipgeolocation.io/ipgeo`, {
      params: {
        apiKey: API_KEY,
        ip: ip, // If no IP is provided, it fetches geolocation for the requester's IP
      },
    });

    // Extract relevant geolocation data from the response
    const {
      ip: ipAddress,
      country_name,
      state_prov,
      city,
      latitude,
      longitude,
      isp,
      time_zone,
    } = response.data;

    // Send the data back to the client as a JSON response
    res.json({
      ip: ipAddress,
      country: country_name,
      state: state_prov,
      city: city,
      latitude: latitude,
      longitude: longitude,
      isp: isp,
      timezone: time_zone.name,
      device: device, // Add device type (Mobile/Tablet/Desktop)
      os: os, // Add OS info (e.g., Windows, Android, iOS)
    });
  } catch (error) {
    console.error("Error fetching geolocation:", error.message);
    res.status(500).json({ error: "Unable to fetch geolocation data" });
  }
});

app.get("/", async (req, res) => {
  const ua = req.useragent;
  console.log("User-Agent:", req.headers["user-agent"]); // Log the user-agent string
  const device = ua.isMobile ? "Mobile" : ua.isTablet ? "Tablet" : "Desktop";
  const os = ua.os;

  // Existing code...
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
