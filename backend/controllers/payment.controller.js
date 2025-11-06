import axios from "axios";
import Order from "../models/order.model.js";

// Utility function to get M-Pesa auth token
const getMpesaToken = async (req, res, next) => {
  const consumerKey = process.env.MPESA_CONSUMER_KEY;
  const consumerSecret = process.env.MPESA_CONSUMER_SECRET;
  const authUrl = process.env.MPESA_AUTH_URL;

  const buffer = Buffer.from(`${consumerKey}:${consumerSecret}`, "base64");
  const auth = `Basic ${buffer.toString("base64")}`;

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

// @desc    Initiate STK Push
// @route   POST /api/payments/stkpush
// @access  Private
const initiateSTKPush = async (req, res, next) => {
  try {
    const { orderId, phone, amount } = req.body;
    const token = await getMpesaToken();

    const shortcode = process.env.MPESA_SHORTCODE;
    const passkey = process.env.MPESA_PASSKEY;
    const callbackUrl = process.env.MPESA_CALLBACK_URL;
    const stkUrl = process.env.MPESA_STK_PUSH_URL;

    const timestamp = new Date()
      .toISOString()
      .replace(/[^0-9]/g, "")
      .slice(0, -3);
    const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString(
      "base64"
    );

    const data = {
      BusinessShortCode: shortcode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: amount,
      PartyA: phone, // User's phone
      PartyB: shortcode,
      PhoneNumber: phone,
      CallBackURL: `${callbackUrl}/${orderId}`, // Attach orderId to callback
      AccountReference: "Rafiki Likastore",
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
// @route   POST /api/payments/callback/:orderId
// @access  Public
const mpesaCallback = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const callbackData = req.body.Body.stkCallback;

    console.log(
      `M-Pesa Callback for Order ${orderId}:`,
      JSON.stringify(callbackData, null, 2)
    );

    if (callbackData.ResultCode === 0) {
      // Payment was successful
      const order = await Order.findById(orderId);
      if (order) {
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
          id: callbackData.CallbackMetadata.Item.find(
            (i) => i.Name === "MpesaReceiptNumber"
          ).Value,
          status: "Successful",
          update_time: callbackData.CallbackMetadata.Item.find(
            (i) => i.Name === "TransactionDate"
          ).Value.toString(),
        };
        await order.save();
      }
    } else {
      // Payment failed or was cancelled
      console.log(
        `Payment failed for order ${orderId}: ${callbackData.ResultDesc}`
      );
    }

    // Acknowledge receipt of the callback to M-Pesa
    res.status(200).json({ message: "Callback received" });
  } catch (error) {
    console.error("Callback processing error:", error);
    next(error);
  }
};

export { initiateSTKPush, mpesaCallback };
