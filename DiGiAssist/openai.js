import { OpenAI } from "openai";
import dotenv from 'dotenv'
dotenv.config()

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API, // This is the default and can be omitted
});

export const openiAPI = async (prompt) => {
    const completion = await openai.chat.completions.create({
        messages: [
            {"role": "system", "content": "Given a email body, provide the following fields in a JSON dict, where applicable: \"Problem\" (keyword like freshping, add firewall port, url status, disk info, running services, lock user, unlock user, package installation, package uninstallation, replication, add user, password reset, remove user, start service, stop service, restart service, ssl certification expiration, iis pool start, iis pool stop, iis site start, iis site stop, user list, iis pool list)\",\"Server\" (null/ localhost/ server name)\", \"Parameter\" (port number/ service name/ website name/ pool name/ username and new password/ username/ IIS website name and IIS pool name)."},
            {"role": "user", "content": `${prompt}`}
          ],
        model: "ft:gpt-3.5-turbo-0613:personal::8hl2TG7C",
    });
    console.log(completion.choices[0].message.content)
    return completion.choices[0].message.content;
  }
