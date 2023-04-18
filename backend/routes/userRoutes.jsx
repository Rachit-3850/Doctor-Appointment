const express = require('express');
const app = express();
const { registerController } = require('../controllers/userCtrl.jsx');

const router = express.Router();

router.post('/register', registerController);
module.exports = router;