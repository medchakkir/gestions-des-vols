import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

let token = null;
let tokenExpiry = null;

const getTokenMiddleware = async (req, res, next) => {
  const isTokenExpired = () => {
    return !tokenExpiry || new Date() >= tokenExpiry;
  };

  const getToken = async () => {
    if (!process.env.AMADEUS_CLIENT_ID || !process.env.AMADEUS_CLIENT_SECRET) {
      throw new Error(
        "Amadeus API credentials are not set in the environment variables."
      );
    }

    try {
      const response = await axios.post(
        "https://test.api.amadeus.com/v1/security/oauth2/token",
        {
          grant_type: "client_credentials",
          client_id: process.env.AMADEUS_CLIENT_ID,
          client_secret: process.env.AMADEUS_CLIENT_SECRET,
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      const { access_token, expires_in } = response.data;
      tokenExpiry = new Date();
      tokenExpiry.setSeconds(tokenExpiry.getSeconds() + expires_in);
      console.info("Token successfully refreshed at", new Date().toString());
      return access_token;
    } catch (error) {
      console.error(
        "Error fetching token:",
        error.response?.data || error.message
      );
    }
  };

  try {
    if (!token || isTokenExpired()) {
      token = await getToken();
    }
    req.token = token;
    next();
  } catch (error) {
    console.error("Middleware error:", error.message);
    res.status(500).send("Internal Server Error");
  }
};

export { getTokenMiddleware };
