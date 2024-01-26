import { Client } from 'ssh2';
import fs from 'fs';
const sshconn = new Client();
sshconn.on('ready', () => {
  console.log('SSH connection established');

});
sshconn.connect({
  host: '172.17.36.68',
  username: 'ceopsmgmt',
  port: 22,
  // privateKey: fs.readFileSync('devopsadm.pem', { encoding: "utf8" })
  password: 'Cm7D5@vN*Z1eq'
});

const extractRegisteredVariableValue = (output) => {
  try {
    let successOut
    const outputData = output.trim();
    if (output.includes('unreachable=0') && output.includes('failed=0')) {
      console.log('Playbook executed successfully!!')
      successOut = true
    }
    else {
      console.log('Error occured during execution!!!');
      successOut = false
    }
    let arr = [];
    if (successOut == true) {
      // console.log(outputData)
      const jsonData = JSON.stringify(outputData, null, 2);
      // console.log('Data as JSON:', jsonData);

      const parsedData = JSON.parse(jsonData); // Parse JSON string to object
      console.log('Parsed Data:', parsedData);
      // Messages = [];
      // console.log(jsonData)
      const lines = parsedData.split('\n');
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.includes('Display Output')) {
          const nextLine = lines[i + 2];
          let nextMessage
          
          if (nextLine && nextLine.includes('"msg": "')) {
            // const errorMessage = nextLine.split('msg": "')[1].split('"')[0];
            // console.log('Message:', errorMessage);
            for (let j = i + 2; j < lines.length; j += 1) {
              const nextMessageLine = lines[j];
              if (nextMessageLine.includes('"msg": "')) {
                nextMessage = `${nextMessageLine.split('"msg": "')[1].split('"')[0]
                  .replace(/\\n/g, '\n').replace(/\\r/g, '')}
                        `;
                // Messages.push(nextMessage);
                // const nextMsgObj = JSON.parse(nextMessage)
                arr.push(nextMessage)
                // console.log(arr)

              } else {
                continue;
              }
            }
            // console.log(arr)
            const data={
              'successOut': successOut,
              'arrayOut': arr
              
            }
            return data
          } else {
            console.log('No message found after "Display Output"');
          }
          // continue;
        }
      }
    }else{
      const data={
        'successOut': successOut,
        'arrayOut': arr
        
      } 
      return data
    }
    // const outputLines = output.split('Received output from Ansible:');
    // const lastOutput = outputLines[outputLines.length - 1];
    // const parsedOutput = JSON.parse(lastOutput);
    // if (parsedOutput.msg) {
    //   return parsedOutput.msg[1]; // Adjust the index as needed based on the actual output structure
    // } else {
    //   return 'Registered variable not found in output';
    // }
  } catch (error) {
    console.error('Error extracting registered variable value:', error);
    return 'Error extracting registered variable value';
  }
};

export const ansibleExec = async (cmd) => {
  // console.log('inside-createPort');
  let output = '';

  // const location = "./../ceopsmgmt/ansible_scripts/";
  // const playbook = "disk-space.yml";
  // const command = `ansible-playbook -e "sysid=${server}" ${location}${playbook}`;

  try {
    // Wrap the SSH execution in a Promise
    output = await new Promise((resolve, reject) => {
      sshconn.exec(cmd, (err, stream) => {
        if (err) {
          console.log('err')
          reject(err);
          return;
        }

        let output = '';

        stream.on('close', (code, signal) => {
          // console.log('Stream closed with code ' + code + ' and signal ' + signal);
          resolve(output); // Resolve the Promise with the collected output
        }).on('data', (data) => {
          output += data;
          // console.log(output);
        });
      });
    });
  } catch (e) {
    console.log(e);
  }

  // Extract the registered variable's value from the output
  const registeredVariableValue = await extractRegisteredVariableValue(output);

  // return registeredVariableValue;
  return registeredVariableValue
}