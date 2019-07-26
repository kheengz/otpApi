## Simple OTP API

### A simple API for generating and verifying a one time PIN (OTP).
it's developed using NodeJS on express and MongoDB. the **OTP** is sent based on the type of value provided.
An SMS is sent when a phone number is provided whereas and email is sent when an email address is provided.

### `/generate`:
Takes as parameter `phoneOrEmail` (value can be either). 
Generates and sends the OTP and returns to the caller **SUCCESS**, if it succeeded. 

### `/verify`:
Takes as parameters `phoneOrEmail` and `otp` and responds with **VERIFIED** if the OTP matches.
It could also respond with **INVALID** if it does not match or if the OTP is expired.

## Requirements.
create a `.env` file and copy the contents of `.env.example`
`APP_SECRET_KEY` : sets a random app secret key use for hashing
`SENDGRID_API_KEY` : sendgrids api key
`SENDGRID_OTP_TEMPLATE`: creata a transactional template on sendgrid and set the template id here.
On sendgrid  creates a substitutions data called `otp_code` which must be enclosed in `{{` and `}}` such that it will be `{{otp_code}}`

### Starting the app on development mode
`npm run dev`

### Running tests
`npm run test`

## NB
You can override the email and sms service providers from the **notification services** file here located at `otpApi/api/services/notification.js`


