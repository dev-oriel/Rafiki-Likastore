import axios from "axios";
import Order from "../models/order.model.js";

// Utility function to get M-Pesa auth token
const getMpesaToken = async (req, res, next) => {
  const consumerKey = process.env.MPESA_CONSUMER_KEY;
  const consumerSecret = process.env.MPESA_CONSUMER_SECRET;
  const authUrl = process.env.MPESA_AUTH_URL;

  // --- THIS IS THE FIX ---
  // The string 'base64' should be in toString(), not Buffer.from()
  const authString = `${consumerKey}:${consumerSecret}`;
  const auth = `Basic ${Buffer.from(authString).toString("base64")}`;
  // --- END OF FIX ---

  try {
    const response = await axios.get(authUrl, {
      headers: {
        Authorization: auth,
      },
    });
    return response.data.access_token;
  } catch (error) {
    console.error(
      "M-Pesa Token Error:",
      error.response ? error.response.data : error.message
    );
    throw new Error("Failed to get M-Pesa token");
  }
};

// Utility to format timestamp 'YYYYMMDDHHMMSS'
const getTimestamp = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${year}${month}${day}${hours}${minutes}${seconds}`;
};

// @desc    Initiate STK Push
// @route   POST /api/payments/stkpush
// @access  Private
const initiateSTKPush = async (req, res, next) => {
  let token;
  try {
    token = await getMpesaToken();
  } catch (error) {
    // If token fails, stop here
    return next(error);
  }

  try {
    const { orderId, phone, amount } = req.body;

    const shortcode = process.env.MPESA_SHORTCODE;
    const passkey = process.env.MPESA_PASSKEY;
    const callbackUrl = process.env.MPESA_CALLBACK_URL;
    const stkUrl = process.env.MPESA_STK_PUSH_URL;

    const timestamp = getTimestamp();
    const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString(
      "base64"
    );

    const data = {
      BusinessShortCode: shortcode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: Math.round(amount), // M-Pesa requires a whole number
      PartyA: phone, // User's phone
      PartyB: shortcode,
      PhoneNumber: phone,
      CallBackURL: `${callbackUrl}/${orderId}`, // Attach orderId to callback
      AccountReference: "RAFIKI LIKASTORE",
      TransactionDesc: "Payment for order",
    };

    const response = await axios.post(stkUrl, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Send back M-Pesa's response
    res.status(200).json(response.data);
  } catch (error) {
    console.error(
      "STK Push Error:",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({ message: "STK Push failed", error: error.message });
  }
};

// @desc    M-Pesa Callback
// @route   POST /api/payments/mpesa/callback/:orderId
// @access  Public
const mpesaCallback = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const callbackData = req.body.Body.stkCallback;

    console.log(`--- M-Pesa Callback for Order ${orderId} ---`);
    console.log(JSON.stringify(callbackData, null, 2));

    if (callbackData.ResultCode === 0) {
      // Payment was successful
      const order = await Order.findById(orderId);
      if (order) {
        order.isPaid = true;
        order.paidAt = Date.now();

        // Extract M-Pesa Receipt Number and other details
        const metadata = callbackData.CallbackMetadata.Item;
        order.paymentResult = {
          id:
            metadata.find((i) => i.Name === "MpesaReceiptNumber")?.Value ||
            "N/A",
          status: "Successful",
          update_time:
            metadata
              .find((i) => i.Name === "TransactionDate")
              ?.Value.toString() || new Date().toISOString(),
        };

        await order.save();
        console.log(`Order ${orderId} marked as PAID.`);
      }
    } else {
      // Payment failed or was cancelled
      console.log(
        `Payment failed for order ${orderId}: ${callbackData.ResultDesc}`
      );
      const order = await Order.findById(orderId);
      if (order) {
        order.paymentResult = {
          id: "N/A",
          status: "Failed",
          update_time: new Date().toISOString(),
        };
        await order.save();
      }
    }

    // Acknowledge receipt of the callback to M-Pesa
    res.status(200).json({ message: "Callback received" });
  } catch (error) {
    console.error("Callback processing error:", error);
    // Don't use next(error) here, as Safaricom needs a 200 OK
    res.status(200).json({ message: "Error processed" });
  }
};

export { initiateSTKPush, mpesaCallback };
