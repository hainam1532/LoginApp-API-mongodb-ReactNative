var express = require('express')
var bodyParser = require('body-parser')
var mongoose = require('mongoose')
var cors = require('cors')
const app = express();



app.use(cors())
app.use(bodyParser.json())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(cors({
    origin: 'http://localhost:19006'
}))


const Schema = mongoose.Schema;
const Account = new Schema(
    {
        email: { type: String },
        name: { type: String },
        password: { type: String },
        username: { type: String },
    },
    {
        timestamps: true,
    }
);

const AccountModel = mongoose.model("account", Account);
// INIT DB

//Kết nối db
const connect = async () => {
    try {
        await mongoose.connect(
            //"mongodb+srv://nnam83395:hainam123@cluster0.g8zxon7.mongodb.net/"
        );
        console.log("Connected to db!");
    } catch (err) {
        console.log(err);
    }
};

// CONNECT DB
connect();

//Xử lý đăng ký
app.post("/api/signup", (req, res) => {
    var username = req.body.username;
    var password = req.body.password;
    var email = req.body.email;

    var data = {
        "username": username,
        "password": password,
        "email": email,
    }

    try {
        const item = new AccountModel(data);
        item.save();
        res.status(404).send('Thành công');
    } catch {
        res.status(606).send('Thất bại');
    }
    
    
})

//Xử lý đăng nhập
app.post('/api/login', async (req, res) => {
    const password = req.body.password;
    const email = req.body.email;
  
    try {
      const account = await AccountModel.findOne({ email: email }).exec();
  
      if (account && account.password === password) {
        // Tài khoản và mật khẩu khớp
        res.send('Đăng nhập thành công');
      } else {
        // Tài khoản hoặc mật khẩu không khớp
        res.status(401).send('Email hoặc mật khẩu không chính xác');
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Không thể kiểm tra đăng nhập');
    }
  });

//Lấy dữ liệu từ db ra
  app.get('/', async (req, res) => {
    try {
      const accounts = await AccountModel.find().exec();
      res.send(accounts);
    } catch (error) {
      console.error(error);
      res.status(800).send('Không thể lấy dữ liệu từ MongoDB');
    }
  }).listen(3000);

console.log("Đang chạy trên PORT 3000");