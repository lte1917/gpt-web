import express from 'express'
import type { RequestProps } from './types'
import type { ChatMessage } from './chatgpt'
import { chatConfig, chatReplyProcess, currentModel } from './chatgpt'
import { auth } from './middleware/auth'
import { limiter } from './middleware/limiter'
import { connection } from './middleware/db'
import { isNotEmptyString } from './utils/is'
import { c } from 'naive-ui'

const app = express()
const router = express.Router()

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
  
    connection.query(query, (error, results) => {
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

router.post('/register', async (req, res) => {
  try {

    const { email,username, password } = req.body as { email: string, username: string, password: string }
    const query = 'SELECT username FROM users WHERE username = ' + '\''+username+'\'';

    connection.query(query, (error, results) => {
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
              
          connection.query(query2, (error, results) => {
            if (error) {
              res.send({ status: 'Fail', message: error, data: null })
            } else {
              res.send({ status: 'Success', message: 'Register successful', data: { username } })
              
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
  connection.query('SELECT * FROM users', (error, results, fields) => {
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
