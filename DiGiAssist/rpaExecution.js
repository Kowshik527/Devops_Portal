import axios from 'axios';

export const rpaExecution = async (jobname) => {

    let job_id = ""
    let rpaOutput = ""

    const response = await axios.post(`https://cloud.robocorp.com/api/v1/workspaces/613f4e73-9619-40d2-a4b5-625fe97396c2/processes/${jobname}/process-runs-integrations?token=b0aXv5Q4qJ49EdTDmuQvbdOxRJnW62nsVsk7OTSH7IaMZlLyLB37LUifI9vph83Iul02Em1dBHe7Glg4JQ7VWJuz7hNCYucBoIdRC5Was4CxoZvGF0cKvOiE7f05TpOon`, {
        "method": "post",
        "headers": {
            "Content-Type": "application/json",
            "Authorization": "RC-WSKEY b0aXv5Q4qJ49EdTDmuQvbdOxRJnW62nsVsk7OTSH7IaMZlLyLB37LUifI9vph83Iul02Em1dBHe7Glg4JQ7VWJuz7hNCYucBoIdRC5Was4CxoZvGF0cKvOiE7f05TpOon"
        },
        "body": "{\"any\":\"valid json\"}"
    })
    console.log(response.data);

    job_id = response.data.id;
    let conditionMet = false;

    async function makeApiRequest() {
        try {
            const response = await axios.get(`https://cloud.robocorp.com/api/v1/workspaces/613f4e73-9619-40d2-a4b5-625fe97396c2/process-runs/${job_id}`, {
                //   "method": "get",
                "headers": {
                    "Content-Type": "application/json",
                    "Authorization": "RC-WSKEY b0aXv5Q4qJ49EdTDmuQvbdOxRJnW62nsVsk7OTSH7IaMZlLyLB37LUifI9vph83Iul02Em1dBHe7Glg4JQ7VWJuz7hNCYucBoIdRC5Was4CxoZvGF0cKvOiE7f05TpOon"
                }
            })
            console.log(response.data);
            console.log(response.data.state)
            if (response.data.state === 'completed') {
                conditionMet = true;
            }
        } catch (error) {
            console.error('Error fetching data from API', error);
        }
    };

    const getreplicationdata = async () => {
        const response =await axios.get("https://cloud.robocorp.com/api/v1/workspaces/613f4e73-9619-40d2-a4b5-625fe97396c2/assets/40cd9e80-b094-4581-b6e7-9fa6f5c36cf2", {
            //   "method": "get",
            "headers": {
                "Content-Type": "application/json",
                "Authorization": "RC-WSKEY 1b5vSzCiHwbEyx96xLnDOHmW20F1guaeGx5Qi0RQL3e5TTjUJkzWkDo5YtJTV4sGS53EJ3aUYDdB5gUotxhHTWxASpeeWBV1WDb78im1aX2c8IqDBUrXw9eAjnS"
            }
        });
        console.log(response.data);
        const payload = response.data.payload.url;
        const data= await axios.get(payload)
        return data.data;
    }

    const timeoutValue = 20000 * 5;
    while (rpaOutput === '') {
        if (!conditionMet) {
            await new Promise(resolve => setTimeout(resolve, timeoutValue));
            console.log("inside interval id");
            await makeApiRequest();
        } else {
            console.log("inside else")
            rpaOutput = await getreplicationdata();
        }
    }
    return rpaOutput;
}


