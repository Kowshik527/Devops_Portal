import { ansibleExec } from './ansibleExecution.js';
import axios from 'axios';
import dotenv from 'dotenv'
dotenv.config()

const getApproval = async (task) => {
  let approvalStatus = "";
  try {

    // const data = JSON.stringify(task);

    // let data = {
    //   taskRequest: task
    // };

    /*
    const data = {
      Replication: [
        {
          name: 'Kaartech WebSite (US Monitor)',
          availability: '100.00 %',
          downtime: '0 hrs 0 min (0.00%)'
        },
        {
          name: 'Kaartech WebSite (India Monitor)',
          availability: '100.00 %',
          downtime: '0 hrs 0 min (0.00%)'
        },
        {
          name: 'ARA Fiori PRD',
          availability: '100.00 %',
          downtime: '0 hrs 0 min (0.00%)'
        },
        {
          name: 'iTop Live',
          availability: '100.00 %',
          downtime: '0 hrs 0 min (0.00%)'
        },
        {
          name: 'Maadaniyah DR Vpn',
          availability: '100.00 %',
          downtime: '0 hrs 0 min (0.00%)'
        },
        {
          name: 'Romana PRD Fiori',
          availability: '100.00 %',
          downtime: '0 hrs 0 min (0.00%)'
        },
        {
          name: 'SPF Approval',
          availability: '100.00 %',
          downtime: '0 hrs 0 min (0.00%)'
        },
        {
          name: 'SPF Mirnah Prod',
          availability: '100.00 %',
          downtime: '0 hrs 0 min (0.00%)'
        },
        {
          name: 'TFC DC VPN',
          availability: '100.00 %',
          downtime: '0 hrs 0 min (0.00%)'
        },
        {
          name: 'TFC VPN',
          availability: '100.00 %',
          downtime: '0 hrs 0 min (0.00%)'
        },
        {
          name: 'MAA Fiori PRD',
          availability: '100.00 %',
          downtime: '0 hrs 0 min (0.00%)'
        },
        {
          name: 'Maadaniyah DR Firewall',
          availability: '100.00 %',
          downtime: '0 hrs 0 min (0.00%)'
        }
      ]
    }

    const extractAndJoinData = (data) => {
      // Get the first key of the data object
      const key = Object.keys(data)[0];

      // Extract values associated with the first key
      const keyValues = data[key];

      if (!keyValues || !Array.isArray(keyValues) || keyValues.length === 0) {
        return ''; // Handle the case where the key does not exist, is not an array, or is an empty array
      }

      // Get all properties present in the objects under the first key
      const properties = Object.keys(keyValues[0]);

      // Convert the objects to an array
      const valuesArray = keyValues.map(item => properties.map(prop => item[prop]).join(', '));

      // Perform join operation to create a string with newline separator
      const resultString = valuesArray.join('\n');

      return resultString;
    };
    */

    // const resultString = extractAndJoinData(data);
    // console.log(resultString)
    // const data="This is line 1.\nThis is line 2."

    const response = await axios.post(
      process.env.EMAIL_APPROVAL_URL,
      task
    );


    console.log("comment-response", response.data);
    approvalStatus = response.data.SelectedOption;
  } catch (error) {
    console.error("Error handling POST request:", error);
  }

  return approvalStatus;
}

export default getApproval;