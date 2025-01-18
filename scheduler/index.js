import axios from "axios";
import moment from "moment";

//node index.js bc461107-93ad-46d8-89c4-84208b5097bd 1 http://localhost:333 5

const organizationId = process.argv?.[2];
const projectId = process.argv?.[3];
const apiUrl = process.argv?.[4] || "http://localhost:3333";
const refreshInterval = process.argv?.[5] || 30; // in s

console.log("START WITH", organizationId, projectId);

const apiCall = async (route) => {
  try {
    const tt = (await axios.get(`${apiUrl}/v1/${route}`))?.data;
    //console.log("===>", tt, "<===")
    return tt;
  } catch (err) {
    console.error(err, `${apiUrl}/v1/${route}`);
  }
};
const getProject = async () => await apiCall(`project/${organizationId}/${projectId}`);
const getHardware = async (hardware) => {
  try {
    return (await axios.get(hardware.api))?.data;
  } catch (err) {
    console.error(err?.message, hardware.api);
    return null;
  }
};
const setActuator = async (actuator, state) => {
  const api = HARDWARES[actuator.idHardware]?.api;
  if (!api) {
    console.error(`No hardware found for id ${actuator.id}`);
  }

  try {
    return (await axios.get(`${api}/state/${state ? "1" : "0"}`))?.data;
  } catch (err) {
    console.error(err?.message, `${api}/state/${state ? "1" : "0"}`);
  }
};

const logical = {
  equal: (a, b) => a && b && a == b,
  notEqual: (a, b) => a && b && a != b,
  greater: (a, b) => a && b && a > b,
  greaterOrEqual: (a, b) => a && b && a >= b,
  lower: (a, b) => a && b && a < b,
  lowerOrEqual: (a, b) => a && b && a <= b,
};

const checkSensor = (hardware) => logical[hardware.operator](HARDWARES[hardware.idHardware], hardware.value) || false;
const checkSwitch = async (hardware) => !!(await getHardware(hardware));

const checkDuration = (condition) => {
  let time = moment();
  time = time.add(1, "hour"); //TMP:
  const start = moment(condition.start, "HH:mm");
  let end = moment(condition.end, "HH:mm");

  if (condition.end < condition.start) {
    end = moment(end).add(1, "day");
  }

  console.log("checkduration", start, end, time, moment(start).isBefore(time), moment(end).isAfter(time));
  return moment(start).isBefore(time) && moment(end).isAfter(time);
};

const checkInterval = (condition) => {
  const possibilities = [];
  let onInterval = parseInt(condition.on.split(":")[0] * 3600) + parseInt(condition.on.split(":")[1] * 60);
  let offInterval = parseInt(condition.off.split(":")[0] * 3600) + parseInt(condition.off.split(":")[1] * 60);
  let start = moment(condition.start, "HH:mm");
  let end = moment(condition.end, "HH:mm");

  if (condition.end < condition.start) {
    end = moment(end).add(1, "day");
    if (moment().format("HH:mm") >= "00:00") {
      start = moment(start).subtract(1, "day");
    }
  }

  while (moment(start).isBefore(end)) {
    const t1 = moment(start).format("YYYY-MM-DD HH:mm");
    start = moment(start).add(onInterval, "second");
    const t2 = moment(start).format("YYYY-MM-DD HH:mm");
    possibilities.push([t1, t2]);
    start = moment(start).add(offInterval, "second");
  }

  const time = moment().format("YYYY-MM-DD HH:mm");
  return possibilities.some((e) => moment(e[0]).isBefore(time) && moment(e[1]).isAfter(time));
};

const checkWeek = (condition) => {
  const d = new Date();
  return condition.days.includes(d.getDay());
};

const resolveCondition = (condition) => {
  if (condition.type === "TIME") {
    if (condition.end?.startsWith("00:00")) {
      condition.end = "24:00";
    }

    const duration = checkDuration(condition);
    if (condition.mode === "DURATION") {
      return duration;
    } else if (condition.mode === "INTERVAL") {
      return checkInterval(condition) && duration;
    } else if (condition.mode === "WEEK") {
      return checkWeek(condition);
    }
  }
  //console.log(condition, checkSensor(condition));
  if (condition.type === "SENSOR") return checkSensor(condition);
  if (condition.type === "SWITCH") return checkSwitch(condition);
};

const recursiveCondition = async (condition) => {
  let result = [];
  if (condition.children) {
    result = await Promise.all(condition.children.map(async (c) => await recursiveCondition(c)));
    //console.log("result", result, condition.type);
    if (!["TIME", "SENSOR", "SWITCH"].includes(condition.type)) {
      if (condition.type === "or") return result.some((e) => !!e);
      if (condition.type === "and") return result.every((e) => !!e);
      return result.every((e) => !!e);
    }
  }

  if (condition.type === "SWITCH") {
    //console.log("resolve actuator", result);
    return result.some((e) => !!e);
  }
  return (await resolveCondition(condition)) && result.every((e) => !!e);
};

let HARDWARES = {};
const main = async () => {
  if (!organizationId) {
    throw new Error("No organizationId");
  }

  if (!projectId) {
    throw new Error("No projectId");
  }

  const project = await getProject();

  if (!project) {
    throw new Error("Project not found");
  }

  const { cycle, hardwares } = project;

  HARDWARES = hardwares.reduce((acc, e) => ({ ...acc, [e.id]: e }), {});
  await Promise.all(
    Object.keys(HARDWARES).map(async (k) => {
      HARDWARES[k].value = await getHardware(HARDWARES[k]);
    })
  );

  await Promise.all(
    cycle.program.program.map(async (actuator) => {
      const state = await recursiveCondition(actuator);
      await setActuator(actuator, state);
      console.log(`Set ACTUATOR '${HARDWARES[actuator.idHardware]?.label}': ${state ? "ON" : "OFF"}`);
      return state;
    })
  );
};

main();
setInterval(() => {
  main();
}, refreshInterval * 1000);
