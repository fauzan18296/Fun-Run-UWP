import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser';
import mysql from 'mysql2'
import midtransClient from 'midtrans-client'
import 'dotenv/config'
const app = express();


const snap = new midtransClient.Snap({
    isProduction: false, // true untuk production
    serverKey: 'YOUR_SERVER_KEY',
    clientKey: 'YOUR_CLIENT_KEY'
});

try{
// Tambahkan di endpoint register
app.post('/api/create-payment', async (req, res) => {
    const parameter = {
        "transaction_details": {
            "order_id": req.body.order_id,
            "gross_amount": req.body.amount
        },
        "credit_card": {
            "secure": true
        },
        "enabled_payments": ["qris"] // Hanya QRIS
    };
    
    const transaction = await snap.createTransaction(parameter);
    res.json(transaction);
});
} catch(err) {
  throw new Error(`Failed connect to midtrans: ${err}`)
}

app.use(cors());
app.use(bodyParser.json());

// Koneksi database
//* FIXME: Have a error because db not have password!
// const db = mysql.createConnection({ 
//   host: 'localhost', 
//   user: 'root',
//   password: '',
//   database: 'funrun_db'
// });

// 1. Endpoint Pendaftaran
app.post('/api/register', (req, res) => {
  const { name, email, phone } = req.body;
  const orderId = `FR${Date.now()}`; // Generate unique ID
  const amount = 50000; // Biaya pendaftaran
  
  const sql = `INSERT INTO participants (order_id, name, email, phone, amount, status) VALUES (?, ?, ?, ?, ?, 'pending')`;
  
  db.query(sql, [orderId, name, email, phone, amount], (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      // Generate QRIS payment link (contoh dengan Midtrans)
      const paymentData = {
        order_id: orderId,
        amount: amount,
        name: name,
        email: email
      };
      
      // Panggil service payment gateway untuk QRIS
      // Ini contoh, sesuaikan dengan provider Anda
      res.json({
        success: true,
        orderId: orderId,
        amount: amount,
        qrCodeUrl: `https://api.midtrans.com/v2/qris?order_id=${orderId}&amount=${amount}`,
        paymentData: paymentData
      });
    }
  });
});

// 2. Endpoint Webhook (dipanggil oleh payment gateway setelah bayar)
app.post('/api/payment-webhook', (req, res) => {
  const { order_id, status, transaction_time } = req.body;
  
  if (status === 'settlement' || status === 'capture') {
    const sql = `UPDATE participants SET status = 'paid', payment_time = ? WHERE order_id = ?`;
    
    db.query(sql, [transaction_time, order_id], (err, result) => {
      if (err) {
        console.error('Update error:', err);
      } else {
        console.log(`Payment successful for order: ${order_id}`);
        // Bisa tambahkan notifikasi email di sini
      }
    });
  }
  
  res.json({ received: true });
});

// 3. Endpoint Cek Status
app.get('/api/check-status/:orderId', (req, res) => {
  const sql = `SELECT * FROM participants WHERE order_id = ?`;
  
  db.query(sql, [req.params.orderId], (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(result[0] || {});
    }
  });
});

// 4. Endpoint Get All Participants (Admin)
app.get('/api/participants', (req, res) => {
  const sql = `SELECT * FROM participants ORDER BY created_at DESC`;
  
  db.query(sql, (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(results);
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}!`);
});