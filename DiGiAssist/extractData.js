import axios from 'axios';

//["task name","technology","task type"]
let allTasks = [
  //port
  ["add firewall port", "Ansible", "sensitive"],
  ["remove firewall port", "Ansible", "sensitive"],
  //package
  ["package installation", "Ansible", "sensitive"],//not for now
  ["package uninstallation", "Ansible", "sensitive"],
  //services
  ["start service", "Ansible", "sensitive"],
  ["service start", "Ansible", "sensitive"],
  ["os service start", "Ansible", "sensitive"],
  ["stop service", "Ansible", "sensitive"],
  ["service stop", "Ansible", "sensitive"],
  ["os service stop", "Ansible", "sensitive"],
  ["restart_service", "Ansible", "sensitive"],
  //user management
  ["add user", "Ansible", "sensitive"],
  ["os add user", "Ansible", "sensitive"],
  ["os user add", "Ansible", "sensitive"],
  ["remove user", "Ansible", "sensitive"],
  ["password reset", "Ansible", "sensitive"],
  ["os user password reset", "Ansible", "sensitive"],
  ["os password reset", "Ansible", "sensitive"],
  //add user expiry and lock user
  ["lock user", "Ansible", "sensitive"],
  ["unlock user", "Ansible", "sensitive"],
  ["user expiry", "Ansible", "sensitive"],
  //iis pool start/stop, site start/stop
  ["iis pool start", "Ansible", "sensitive"],
  ["iis pool stop", "Ansible", "sensitive"],
  ["iis site start", "Ansible", "sensitive"],
  ["iis site stop", "Ansible", "sensitive"],

  ["disk info", "Ansible", "non sensitive"],
  ["os version", "Ansible", "non sensitive"],
  ["allowed ports", "Ansible", "non sensitive"],
  ["running services", "Ansible", "non sensitive"],
  ["user list", "Ansible", "non sensitive"],
  ["ssl certification expiration", "Ansible", "non sensitive"],
  ["url status", "Ansible", "non sensitive"],
  ["iis pool list", "Ansible", "non sensitive"],
  //iis pool list

  ["freshping", "RPA", "non sensitive"],
  ["replication", "RPA", "non sensitive"],
]

//fetch from excel
let win_servers = ['win', 'dxspfpoprd']
let linux_servers = ['arawddev', 'Management-VM']
let urls =
{
  "kaartech website": "https://kaartech.com",
  "itop website": "https://support.kaarcloud.com",
  "ara fiori production website": "https://sapfiori.arapetroleum.com:44300/sap/bc/ui5_ui5/ui2/ushell/shells/abap/FioriLaunchpad.htm",
  "maadaniyah fiori production website": "https://msap.maadaniyah.com:44303/sap/bc/ui5_ui5/ui2/ushell/shells/abap/FioriLaunchpad.html",
  "romana fiori production website": "https://s4prd.romanawater.com:44395/sap/bc/ui5_ui5/ui2/ushell/shells/abap/FioriLaunchpad.html?sap-client=800&sap-language=EN",
  //dev urls
}

//ansible playbook execution
//with getCommand
export const getCommand = (modelOutput) => {
  const location = "./../ceopsmgmt/ansible_scripts/testing/";

  const problem = modelOutput[0].toLowerCase().trim();
  const servername = modelOutput[1].trim();
  const parameter = modelOutput[2];

  if (['add firewall port', 'remove firewall port'].includes(problem)) {
    if (win_servers.includes(servername))
      return `ansible-playbook -e "sysid=${servername}" -e "port_no=${modelOutput[2]}" -e "option='${problem}'" ${location}win-port-management.yml`;
    else
      return `ansible-playbook -e "sysid=${servername}" -e "port_no=${modelOutput[2]}" -e "option='${problem}'" ${location}port-management.yml`;
  }

  //add user, password reset
  else if (problem === "remove user") {
    if (win_servers.includes(servername))
      return `ansible-playbook -e "sysid=${servername}" -e "username=${modelOutput[2]}" -e "option='${problem}'" ${location}win-user-management.yml`;
    else
      return `ansible-playbook -e "sysid=${servername}" -e "username=${modelOutput[2]}" -e "option='${problem}'" ${location}user-management1.yml`;
  }

  //remove user
  else if (['add user', 'os add user','os user add', 'password reset'].includes(problem)) {
    if (win_servers.includes(servername))
      return `ansible-playbook -e "sysid=${servername}" -e "username=${modelOutput[2]}" -e "password=${modelOutput[3]}" -e "option='add user'" ${location}win-user-management.yml`;
    else
      return `ansible-playbook -e "sysid=${servername}" -e "username=${modelOutput[2]}" -e "password=${modelOutput[3]}" -e "option='add user'" ${location}user-management1.yml`;
  }

  else if (['password reset', 'os password reset', 'os user password reset'].includes(problem)) {
    if (win_servers.includes(servername))
      return `ansible-playbook -e "sysid=${servername}" -e "username=${modelOutput[2]}" -e "password=${modelOutput[3]}" -e "option='password reset'" ${location}win-user-management.yml`;
    else
      return `ansible-playbook -e "sysid=${servername}" -e "username=${modelOutput[2]}" -e "password=${modelOutput[3]}" -e "option='password reset'" ${location}user-management1.yml`;
  }


  //user lock/unlock
  if (['lock user', 'unlock user'].includes(problem)) {
    if (win_servers.includes(servername))
      return `ansible-playbook -e "sysid=${servername}" -e "username=${modelOutput[2]}" -e "option='${problem}'" ${location}win-user-lock-unlock.yml`;
    else
      return `ansible-playbook -e "sysid=${servername}" -e "username=${modelOutput[2]}" -e "option='${problem}'" ${location}user_lock_unlock.yml`;
  }
  //user expiry
  if (problem === "user expiry") {
    return `ansible-playbook -e "sysid=${servername}" -e "username=${modelOutput[2]}" -e "username=${modelOutput[3]}" ${location}user-expiry.yml`;
  }
  //os info
  else if (problem === "os version") {
    if (win_servers.includes(servername))
      return `ansible-playbook -e "sysid=${servername}" ${location}win-os-info.yml`
    else
      return `ansible-playbook -e "sysid=${servername}" ${location}os-info.yml`
  }

  //disk info
  else if (problem === "disk info") {
    if (win_servers.includes(servername)) {
      return `ansible-playbook -e "sysid=${servername}" ${location}win-disk-info.yml`;
    } else {
      return `ansible-playbook -e "sysid=${servername}" ${location}disk-space.yml`;
    }
  }

  //allowed ports
  else if (problem === "allowed ports") {
    if (win_servers.includes(servername))
      return `ansible-playbook -e "sysid=${servername}" ${location}win-open-ports.yml`
    else
      return `ansible-playbook -e "sysid=${servername}" ${location}list-open-ports.yml`
  }

  //running services
  else if (problem === "running services") {
    if (win_servers.includes(servername))
      return `ansible-playbook -e "sysid=${servername}" ${location}win-running-services.yml`
    else
      return `ansible-playbook -e "sysid=${servername}" ${location}get-running-services.yml`
  }

  //user list
  else if (problem === "user list") {
    if (win_servers.includes(servername))
      return `ansible-playbook -e "sysid=${servername}" ${location}win-get-users.yml`
    else
      return `ansible-playbook -e "sysid=${servername}" ${location}get-users.yml`
  }

  //package installation
  else if (problem === "package installation") {
    return `ansible-playbook -e "sysid=${servername}" -e "package_state=present" "package_name=${modelOutput[2]}" ${location}manage-package-rhel.yml`
  }

  //package uninstallation
  else if (problem === "package uninstallation") {
    return `ansible-playbook -e "sysid=${servername}" -e "package_state=absent" "package_name=${modelOutput[2]}" ${location}manage-package-rhel.yml`
  }

  //start service
  else if (['start service', 'service start', 'os service start'].includes(problem)) {
    if (win_servers.includes(servername))
      return `ansible-playbook -e "sysid=${servername}" -e "service_name=${modelOutput[2]}" -e "service_state=started" ${location}manage-services-win.yml`
    else
      return `ansible-playbook -e "sysid=${servername}" -e "service_name=${modelOutput[2]}" -e "service_state=started" ${location}manage-services.yml`
  }

  //iis pool start
  else if (problem === "iis pool start") {
    if (win_servers.includes(servername))
      return `ansible-playbook -e "sysid=${servername}" -e "poolName=${modelOutput[2]}" -e "action=started" ${location}manage-win-app-pool.yml`;
  }

  //iis pool stop
  else if (problem === "iis pool stop") {
    if (win_servers.includes(servername))
      return `ansible-playbook -e "sysid=${servername}" -e "poolName=${modelOutput[2]}" -e "action=stopped" ${location}manage-win-app-pool.yml`;
  }

  //iis site start
  else if (problem === "iis site start") {
    if (win_servers.includes(servername))
      return `ansible-playbook -e "sysid=${servername}" -e "website_name=${modelOutput[2]}" ${location}win-site-start.yml`;
  }

  //iis site stop
  else if (problem === "iis site stop") {
    if (win_servers.includes(servername))
      return `ansible-playbook -e "sysid=${servername}" -e "website_name=${modelOutput[2]}" ${location}win-site-up-down.yml`;
  }

  //iis pool list
  else if (problem === "iis pool list") {
    if (win_servers.includes(servername))
      return `ansible-playbook -e "sysid=${servername}" ${location}win-app-pool-list.yml`;
  }

  //url status
  else if (problem === "url status") {
    return `ansible-playbook -e "url=${urls[parameter.toLowerCase()]}" ${location}url_status.yml`;
  }

  //stop service
  else if (['stop service', 'service stop', 'os service stop'].includes(problem)) {
    if (win_servers.includes(servername))
      return `ansible-playbook -e "sysid=${servername}" -e "service_state=stopped" -e "service_name=${modelOutput[2]}" ${location}manage-services-win.yml`
    else
      return `ansible-playbook -e "sysid=${servername}" -e "service_state=stopped" -e "service_name=${modelOutput[2]}" ${location}manage-services.yml`
  }

  //restart service
  else if (problem === "restart_service") {
    if (win_servers.includes(servername))
      return `ansible-playbook -e "sysid=${servername}" -e "service_state=restarted" -e "service_name=${modelOutput[2]}" ${location}manage-services-win.yml`
    else
      return `ansible-playbook -e "sysid=${servername}" -e "service_state=restarted" -e "service_name=${modelOutput[2]}" ${location}manage-services.yml`
  }

  //ssl certification expiration
  else if (problem === "ssl certification expiration") {
    let url = new URL(urls[modelOutput[2]]);
    let mainDomain = url.hostname;
    let port = url.port || (url.protocol === 'https:' ? 443 : 80);
    return `ansible-playbook -e "url=${mainDomain} port=${port}" ${location}ssl-cert-expiry-check.yml`
  }
  else {
    console.log("command not found")
    console.log("Need to add this problem to the list")
  }
}

export const jobid = async (modelOutput) => {
  if (modelOutput[0].toLowerCase().trim() == "freshping") {
    return "b6b83531-fd31-4ee6-b2ee-e7660d10e0a4"
  }
  else if (modelOutput[0].toLowerCase().trim() == "replication") {
    return "a3e76732-958a-43f5-b7a3-3ccaaa97191c"
  }
}  

export const streamLineTask = async (modelOutput) => {

  let matchingTask = await allTasks.find(task => task[0] === modelOutput[0].toLowerCase().trim())

  if (matchingTask) {
    let [task, technology, type] = matchingTask;
    return matchingTask
  }
  else {
    console.log("new type of request,it need to be handled")
    return ["N/A", "N/A", "new task"]
  }

}



