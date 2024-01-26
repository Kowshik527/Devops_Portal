import { ansibleExec } from './ansibleExecution.js';
import { streamLineTask, getCommand } from './extractData.js';
import getApproval from './GetApproval.js';
import { uploadToAzureBlobStorage } from './cloudExcel.js';
import { writeToExcel } from './cloudExcel.js';
import { jobid } from './extractData.js';
import { rpaExecution } from './rpaExecution.js';
import { openiAPI } from './openai.js';

// import writeToExcel from './newTask.js';


const DiGiAssist = async (req, res) => {

    try {

        // Start the time
        const startTime = performance.now();


        // const requestData = req.body;

        // const input_sentence = {

        //   email_text: requestData.body,

        // };


        // const apiUrl = "https://db01-34-70-12-44.ngrok.io/extract_info"

        // const response = await axios.post(apiUrl, input_sentence);

        // console.log('API Response:', response.data); // Add this line to inspect the response

        // const { server_names: serverNames, problem, ports } = response.data;

        // const dataarray = [problem[0], serverNames[0], ports[0]]
        const prompt = "Hi team, check wether the kaartech website is up or down."
        const jsonString = await openiAPI(prompt);
        const jsonData = JSON.parse(jsonString);
        let dataarray = [
            jsonData.Problem,
            jsonData.Server,
            jsonData.Parameter
        ];
        if(['add user', 'os add user', 'os user add'].includes(dataarray[0]) && dataarray[2].includes(',')){
            let parameterValues = jsonData.Parameter.split(',');
            dataarray.splice(2, 1); 
            dataarray = dataarray.concat(parameterValues);
        }
        console.log(dataarray);

        // const dataarray = ["ssl certification expiration ", "null", "kaartech website"]

        // const dataarray = ["replication", "N/A", "N/A"]
        // await getApproval("Hello");

        let result = "";
        let output = "";
        let Successoutput = "";
        let streamLineResult = await streamLineTask(dataarray);

        console.log(streamLineResult)

        if (streamLineResult[2] === "sensitive") {

            console.log("------------------------");
            console.log("Requested for approval");
            console.log("------------------------");
            result = "Approve"
            // result = await getApproval(requestData.body)
            // result = await getApproval(dataarray)

        } else if (streamLineResult[2] === "non sensitive") {
            result = "Approve"
        } else if (streamLineResult[2] === "new task") {
            result = "new task";
            // await getApproval(output)
            const staticString = "This is third line to be inserted";

            try {
                const filePath = 'new-tasks-collection.xlsx';
                await writeToExcel(staticString, filePath);
                console.log('Email stored and Excel file uploaded to Azure Blob Storage');
            } catch (error) {
                console.error('Error:', error);
            }
        }
        // Successoutput=false
        // console.log(output)

        if (result === "Approve") {
            let command;
            if (streamLineResult[1] === "RPA") {
                let job = await jobid(dataarray)
                console.log(job)
                const data = await rpaExecution(job);
                console.log("DigiAssist Output:\n", data)

                const key = Object.keys(data)[0];
                const keyValues = data[key];

                if (!keyValues || !Array.isArray(keyValues) || keyValues.length === 0) {
                    return '';
                }

                const properties = Object.keys(keyValues[0]);
                const valuesArray = keyValues.map(item => properties.map(prop => item[prop]).join(', '));
                output = valuesArray.join('\n');

                // await getApproval(output);
            }
            else if (streamLineResult[1] === "Ansible") {

                command = await getCommand(dataarray);
                console.log(command)
                let { successOut, arrayOut } = await ansibleExec(command);
                if (arrayOut.length == 1)
                    output = arrayOut.map(item => item.trim()).join('');
                else
                    output = arrayOut.map(item => item.replace(/\s+$/, '\n')).join('');
                console.log(output);

                // console.log(`digi output \n ${output}`)
                await getApproval(output)

            }
            console.log("----------------------------------");
            console.log(`Task has been completed by ${streamLineResult[1]}!!!`);
            console.log("----------------------------------");
        }
        else if (result === "Reject") {

            output = "Your Request has been Rejected."
            console.log("--------------------------")
            console.log("Request has been Rejected")
            console.log("--------------------------")

        }
        else {
            output = "It's a new task, DigiAssistant need to be trained."
        }

        const endTime = performance.now();

        // Calculate the time taken in milliseconds
        const timeTakenInMilliseconds = endTime - startTime;

        // Convert milliseconds to minutes and seconds
        const timeTakenInMinutes = Math.floor(timeTakenInMilliseconds / 60000);
        const remainingMilliseconds = timeTakenInMilliseconds % 60000;
        const timeTakenInSeconds = remainingMilliseconds / 1000;

        const roundedSeconds = timeTakenInSeconds.toFixed(4);

        // Output the time taken in minutes and seconds
        console.log(`Time taken: ${timeTakenInMinutes} minutes and ${roundedSeconds} seconds.`);

        const performedTime = `Time taken to complete the task: ${timeTakenInMinutes} minutes and ${roundedSeconds} seconds.`

        const data = {
            // "subject": requestData.subject,
            // "body": response.data,
            "status": result,
            "output": output,
            "performedTime": performedTime,
        }
        return data;
    } catch (error) {
        console.error('Error handling POST request:', error);
        res.status(500).json({ error: 'Internal server error' });
    }

}

export default DiGiAssist;