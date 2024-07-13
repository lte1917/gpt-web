import express, { response } from 'express'
import type { RequestProps } from './types'
import type { ChatMessage } from './chatgpt'
import { chatConfig, chatReplyProcess, currentModel } from './chatgpt'
import { auth } from './middleware/auth'
import { limiter } from './middleware/limiter'
import { pool } from './middleware/db'
import { isNotEmptyString } from './utils/is'
import { c } from 'naive-ui'
import nodemailer from 'nodemailer'
import { env } from 'process'
import { error } from 'console'
import e from 'express'
import { rand } from '@vueuse/core'
import { floor } from 'naive-ui/es/color-picker/src/utils'

const app = express()
const router = express.Router()
const MAIL_API_KEY = process.env.MAIL_API_KEY
const transporter = nodemailer.createTransport({
  service: 'qq', //使用的邮箱服务，这里qq为例
  port: 465, //邮箱服务端口号
  secure: false, // true for 465, false for other ports
  auth: {
    user: "2252351619@qq.com", //  邮箱地址
    pass: MAIL_API_KEY, //授权码
  },
});


let validateTimeMap = new Map<string, number>();
let validateCodeMap = new Map<string, string>();
app.use(express.static('public'))
app.use(express.json())

app.all('*', (_, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'authorization, Content-Type')
  res.header('Access-Control-Allow-Methods', '*')
  next()
})

router.post('/chat-process', [auth, limiter], async (req, res) => {
  res.setHeader('Content-type', 'application/octet-stream')

  try {
    const { prompt, options = {}, systemMessage, temperature, top_p } = req.body as RequestProps
    let firstChunk = true
    await chatReplyProcess({
      message: prompt,
      lastContext: options,
      process: (chat: ChatMessage) => {
        res.write(firstChunk ? JSON.stringify(chat) : `\n${JSON.stringify(chat)}`)
        firstChunk = false
      },
      systemMessage,
      temperature,
      top_p,
    })
  }
  catch (error) {
    res.write(JSON.stringify(error))
  }
  finally {
    res.end()
  }
})

router.post('/config', auth, async (req, res) => {
  try {
    const response = await chatConfig()
    res.send(response)
  }
  catch (error) {
    res.send(error)
  }
})

router.post('/session', async (req, res) => {
  try {
    const AUTH_SECRET_KEY = process.env.AUTH_SECRET_KEY
    const hasAuth = isNotEmptyString(AUTH_SECRET_KEY)
    res.send({ status: 'Success', message: '', data: { auth: hasAuth, model: currentModel() } })
  }
  catch (error) {
    res.send({ status: 'Fail', message: error.message, data: null })
  }
})

router.post('/verify', async (req, res) => {
  try {
    const { token } = req.body as { token: string }
    if (!token)
      throw new Error('Secret key is empty')

    if (process.env.AUTH_SECRET_KEY !== token)
      throw new Error('密钥无效 | Secret key is invalid')

    res.send({ status: 'Success', message: 'Verify successfully', data: null })
  }
  catch (error) {
    res.send({ status: 'Fail', message: error.message, data: null })
  }
})

router.post('/login', async (req, res) => {
  try {

    const { username, password } = req.body as { username: string, password: string }
    const query = 'SELECT * FROM users WHERE username =' + '\''+username+'\'' + ' AND password =' + '\''+password+'\''

    pool.query(query, (error, results) => {
      if (error) {
        res.send({ status: 'Fail', message: 'Database error', data: null })
      } else {
        if (results.length > 0) {
          // Successful login
          res.send({ status: 'Success', message: 'Login successful', data: { username } })
        } else {
          // Invalid credentials
          res.send({ status: 'Fail', message: 'Invalid username or password', data: null })
        }
      }
    })
  }
  catch (error) {
    res.send({ status: 'Fail', message: error.message, data: null })
  }
})

router.post('/validateMail', async (req, res) => {
  try {
    const { email } = req.body as { email: string }
    const validTime = new Date().getTime()
    if (!validateTimeMap.has(email)) {
      validateTimeMap.set(email, validTime)
    } else {
      if (validTime - validateTimeMap.get(email) < 60000) {
        res.send({ status: 'Fail', message: 'Please wait for ' + (Math.round(60-(validTime - validateTimeMap.get(email))/1000))+'seconds to resend your code', data: null })
        return
      }
    }
    const code = Math.floor(Math.random() * 1000000).toString().padStart(6, '0')
    transporter.sendMail({
      from: '2252351619@qq.com', // 发信邮箱
      to: email, //发送的邮箱列表
      subject: 'Sustech Chat 注册验证码', // 主题
      text: '【Sustech Chat】验证码 '+code+',用于Sustech Chat的身份验证，五分钟内有效，请勿泄露和转发。您正在注册Sustech Chat网站，如非本人操作，请忽略此邮件', // 文本内容
    }).then(() =>{
      validateCodeMap.set(email, code)
      validateTimeMap.set(email, validTime)
      res.send({ status: 'Success', message: 'Validate code has been sent to your email', data: null })
    });
  }catch (error) {
    res.send({ status: 'Fail', message: error.message, data: null })
  }
}
)

router.post('/register', async (req, res) => {
  try {
    //code is verify code
    const { email,code,username, password } = req.body as { email: string, code: string, username: string, password: string }
    if (!validateTimeMap.has(email)) {
      res.send({ status: 'Fail', message: 'Please validate your email first', data: null })
      return
    } else if (new Date().getTime() - validateTimeMap.get(email) > 300000) {
        res.send({ status: 'Fail', message: 'Validate code is expired', data: null })
        return
    } else if (validateCodeMap.get(email).toString() !== code.toString()) {
      console.log(validateCodeMap.get(email))
      console.log(code)
        res.send({ status: 'Fail', message: 'Validate code is incorrect', data: null })
        return
    }

    const query = 'SELECT username FROM users WHERE username = ' + '\'' + username + '\'';
    pool.query(query, (error, results) => {
      if (error) {
        res.send({ status: 'Fail', message: error, data: null })
      } else {
        if (results.length > 0) {
          // 已被注册
          res.send({ status: 'Fail', message: 'Username already exists', data: null })
        } else {
          //注册日期为当天
          const date = new Date().toISOString().slice(0, 10);
          const query2 = 'INSERT INTO users (email, username, password,RegistrationDate) VALUES('
            + '\'' + email + '\'' + ',' + '\'' + username + '\'' + ',' + '\'' + password + '\''+ ',' + '\'' + date +'\''+ ')';

          pool.query(query2, (error, results) => {
            if (error) {
              res.send({ status: 'Fail', message: error, data: null })
            } else {
              res.send({ status: 'Success', message: 'Register successful', data: { username } })
              validateCodeMap.set(email, '')
            }
          })
        }
      }
    })
  }
  catch (error) {
    res.send({ status: 'Fail', message: error.message, data: null })
  }
})


// test
router.get('/users', async (req, res) => {
  pool.query('SELECT * FROM users', (error, results, fields) => {
    if (error) {
      res.status(500).json({ message: 'Error fetching users from database' });
    } else {
      res.status(200).json(results);
    }
  });
})

app.use('', router)
app.use('/api', router)
app.set('trust proxy', 1)

app.listen(3002, () => globalThis.console.log('Server is running on port 3002'))
