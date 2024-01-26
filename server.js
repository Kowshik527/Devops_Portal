import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import basicAuth from 'express-basic-auth';
import dotenv from 'dotenv'
import { Client } from 'ssh2';
import fs from 'fs';
import axios from 'axios';
import { performance } from 'perf_hooks';
// import localtunnel from 'localtunnel';
const app = express();
const PORT = 8001;
app.use(cors());
app.use(bodyParser.json());
dotenv.config()


// const sshconn = new Client();


import organizationroute from './Routes/AutoInfra/Organizations/Organizations.js'
import usersroute from './Routes/Users/Users.js'
import inventoryroute from './Routes/AutoInfra/Inventory/Inventory.js'
import projectroute from './Routes/AutoInfra/Projects/Projects.js'
import { ansibleExec } from './DiGiAssist/ansibleExecution.js';
import { request } from 'http';
import { streamLineTask, getCommand } from './DiGiAssist/extractData.js';
import DiGiAssist from './DiGiAssist/DiGiAssist.js';


// import jobsroute from './Routes/AutoInfra/NewJob/NewJob.js'



//const mongo_db_url="mongodb+srv://yaswanth:Yaswanth%4001@cluster0.jdcz7eb.mongodb.net/?retryWrites=true&w=majority"

const connectionString = 'mongodb+srv://yaswanth:Yaswanth%4001@cluster0.jdcz7eb.mongodb.net/Devops?retryWrites=true&w=majority';

//connecting mongodb
mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => { let a = "" })
  .catch((error) => console.error('Error connecting to MongoDB Atlas:', error));

// sshconn.on('ready', () => {
//   let a=""
//   // console.log('SSH connection established');

// });


// sshconn.connect({
//   host: '172.17.36.68',
//   username: 'devopsadm',
//   port: 22,
//   privateKey: fs.readFileSync('devopsadm.pem', { encoding: "utf8" })
//   // password: 'Cm7D5@vN*Z1eq'
// });
/*
const users = {
  [process.env.API_USERNAME]: process.env.API_PASSWORD,
};

// Use basicAuth middleware
app.use(basicAuth({
  users,
  challenge: true, // Send 401 when unauthorized
  unauthorizedResponse: 'Unauthorized'
}));
*/


app.use('/api/users', usersroute)
app.use('/api/dashboard-autoinfra', organizationroute)
app.use('/api/dashboard-autoinfra', inventoryroute)
app.use('/api/dashboard-autoinfra', projectroute)
// app.use('/api/dashboard-autoinfra',jobsroute)



// app.post('/api/dashboard-autoinfra/jobs/getdata',async (req, res) => {
//   console.log("-----------------------")
//   const data = req.body;
//   console.log('job',data);

//   let responseSent = false;
//   const sendResponse = (output) => {
//     if (!responseSent) {
//       responseSent = true;
//       res.status(200).send(JSON.stringify(output));

//     } 
//   };

//   try {
//     const location = "./../ceopsmgmt/ansible_scripts/ara_status/"

//     console.log(`ansible-playbook -e "sysid=${data.hostname}" ${location}${data.playbook}`)

//     sshconn.exec(`ansible-playbook -e "sysid=${data.hostname}" ${location}${data.playbook}`, (err, stream) => {
//       if (err){throw err;}
//       let output = '';

//       stream.on('close', (code, signal) => {
//         console.log('Stream closed with code ' + code + ' and signal ' + signal);
//         sendResponse(output);
//         return;
//       }).on('data', (data) => {
//         output += data;
//         console.log('Received output from Ansible: ' + data);
//       });
//     });
//   }
//   catch (e) {
//     console.log(e)
//   }
// });

// export const ansibleExec = async (server, port) => {
//   console.log('inside-ansibleExec');
//   let output = '';

//   const location = "./../ceopsmgmt/ansible_scripts/testing/";
//   const playbook = "add-firewall-ports.yml";
//   const command = `ansible-playbook -e "sysid=${server}" -e "port=${port}" ${location}${playbook}`;

//   try {
//     // Wrap the SSH execution in a Promise
//     output = await new Promise((resolve, reject) => {
//       sshconn.exec(command, (err, stream) => {
//         if (err) {
//           reject(err);
//           return;
//         }

//         let output = '';

//         stream.on('close', (code, signal) => {
//           console.log('Stream closed with code ' + code + ' and signal ' + signal);
//           resolve(output); // Resolve the Promise with the collected output
//         }).on('data', (data) => {
//           output += data;
//           console.log('Received output from Ansible: ' + data);
//         });
//       });
//     });
//   } catch (e) {
//     console.log(e);
//   }

//   return output;
// }

app.post('/api/teamsMessage', async (req, res) => {

  console.log("----------------------------------")
  console.log("Problem Triggered through Teams")
  console.log("----------------------------------")

   try {

    const digiresult = await DiGiAssist(req)
    // console.log(digiresult);
  
     res.status(200).json(digiresult);

   } catch (error) {
     console.error('Error handling POST request:', error);
     res.status(500).json({ error: 'Internal server error' });
   }

})
 
app.post('/api/email', async (req, res) => {
  
  console.log("----------------------------------")
  console.log("Problem Triggered through Mail")
  console.log("----------------------------------")

   try {

    const digiresult = await DiGiAssist(req)

    console.log(digiresult);

    console.log('---------------')

    res.status(200).json(digiresult);
  } catch (error) {
    console.error('Error handling POST request:', error);
     res.status(500).json({ error: 'Internal server error' });
   }
});






app.listen(PORT, async () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  // const tunnel = await localtunnel({ port: 8000 });
  // console.log('Tunnel URL:', tunnel.url);
  // tunnel.on('close', () => {
  //   console.log('Tunnel has been closed');
  // });

});

