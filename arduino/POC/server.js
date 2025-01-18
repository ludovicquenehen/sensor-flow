const ArduinoRelay = () => {
    return axios.create({ baseURL: "http://192.168.2.50" });
  },
  ArduinoWeather = () => {
    return axios.create({ baseURL: "192.168.2.51" });
  },
  ArduinoWater = () => {
    return axios.create({ baseURL: "192.168.2.52" });
  },
  formatHour = (e) =>
    (parseInt(e.split(":")[0]) < 10 ? "0" + e.split(":")[0] : e.split(":")[0]) +
    ":" +
    (parseInt(e.split(":")[1]) < 10 ? "0" + e.split(":")[1] : e.split(":")[1]),
  checkDuration = (e) => {
    let t = new Date(),
      a = t.getHours() + ":" + t.getMinutes();
    return (a = formatHour(a)), e.start > e.end ? !(e.start <= a && a <= e.end) : e.start <= a && a <= e.end;
  },
  checkInterval = (e) => {
    let t = [],
      a = new Date("July 4 2000 " + e.dayStart),
      n = new Date("July 4 2000 " + e.dayEnd),
      r = null,
      s = parseInt(3600 * e.dayOnInterval.split(":")[0]) + parseInt(60 * e.dayOnInterval.split(":")[1]),
      i = parseInt(3600 * e.dayOffInterval.split(":")[0]) + parseInt(60 * e.dayOffInterval.split(":")[1]);
    for (; a <= n; )
      t.push(formatHour(a.getHours() + ":" + a.getMinutes())),
        (r = new Date("July 4 2000 " + a.getHours() + ":" + a.getMinutes())),
        (a = new Date(r.getTime() + 1e3 * s)),
        t.push(formatHour(a.getHours() + ":" + a.getMinutes())),
        (a = new Date(a.getTime() + 1e3 * i));
    for (
      a = new Date("July 4 2000 " + e.nightStart),
        n = new Date("July 4 2000 " + e.nightEnd),
        r = null,
        s = parseInt(3600 * e.nightOnInterval.split(":")[0]) + parseInt(60 * e.nightOnInterval.split(":")[1]),
        i = parseInt(3600 * e.nightOffInterval.split(":")[0]) + parseInt(60 * e.nightOffInterval.split(":")[1]);
      a <= n;

    )
      t.push(formatHour(a.getHours() + ":" + a.getMinutes())),
        (r = new Date("July 4 2000 " + a.getHours() + ":" + a.getMinutes())),
        (a = new Date(r.getTime() + 1e3 * s)),
        t.push(formatHour(a.getHours() + ":" + a.getMinutes())),
        (a = new Date(a.getTime() + 1e3 * i));
    let l = new Date(),
      o = l.getHours() + ":" + l.getMinutes();
    (o = (l = new Date()).getHours() + ":" + l.getMinutes()), (o = formatHour(o));
    let u = t[0],
      c = 0;
    for (; u < o; ) (u = t[c]), c++;
    return c % 2 == 1 && c--, t[c - 2] <= o && o <= t[c - 1];
  },
  checkSensor = async (e) => {
    let t = [];
    for (let a of e.sensors) {
      const e = new Promise(async (e, t) => {
        try {
          let t =
            "weather" === a.type
              ? await axios.create({ baseURL: "192.168.2.51" }).get("/value/" + a.pin)
              : await axios.create({ baseURL: "192.168.2.52" }).get("/value/" + a.pin);
          (t = parseFloat(t.data)),
            (a.minValue = parseFloat(a.minValue)),
            (a.maxValue = parseFloat(a.maxValue)),
            a.minValue > a.maxValue ? (t < a.minValue || t > a.maxValue ? e(!1) : e(!0)) : t > a.minValue && t < a.maxValue ? e(!0) : e(!1);
        } catch (t) {
          e(!1);
        }
      });
      t.push(e);
    }
    let a = await Promise.all(t)
      .then((e) => e)
      .catch((e) => {
        console.log(e);
      });
    return (
      "" !==
      Object.values(a)
        .map((e) => (e ? "e" : ""))
        .join("")
    );
  },
  checkPin = async (e) => {
    let t = [];
    if (save[e]) {
      if (!save[e].isLock) {
        for (let a of save[e].config) {
          const n = new Promise(async (t, n) => {
            console.log(e);
            let r = a.type,
              s = "duration" == r ? checkDuration(a) : "interval" == r ? checkInterval(a) : await checkSensor(a);
            t(s), console.log(e, r, s);
          });
          t.push(n);
        }
        let a = await Promise.all(t)
            .then((e) => e)
            .catch((e) => {
              console.log(e);
            }),
          n =
            "" !==
            Object.values(a)
              .map((e) => (e ? "e" : ""))
              .join("");
        (save[e].state = n), console.log("  - CHECK PIN", e, n);
      }
      return save[e].state;
    }
    return console.log("  - CHECK PIN", e, "undefined"), -1;
  },
  checkPins = async () => {
    try {
      let e = new Date(),
        t = e.getHours() + ":" + e.getMinutes();
      (t = formatHour(t)), console.log("BEGIN CHECK PINs", t);
      for (let e = 0; e < 5; e++) checkPin(e);
      console.log("END CHECK PINs");
    } catch (e) {}
  },
  cleanPins = async () => {
    for (let e = 0; e < 5; e++) save[e].isLock = !1;
  };
let save = {
  0: { state: !0, config: [{ type: "duration", start: "06:00:00", end: "23:59:00" }], arduino: "weather", isLock: !1 },
  1: {
    state: !1,
    config: [
      {
        type: "interval",
        dayStart: "06:00:00",
        dayEnd: "23:59:00",
        nightStart: "23:59:00",
        nightEnd: "06:00:00",
        dayOnInterval: "00:05:00",
        dayOffInterval: "03:00:00",
        nightOnInterval: "00:00:00",
        nightOffInterval: "06:00:00",
      },
    ],
    arduino: "weather",
    isLock: !1,
  },
  2: {
    state: !1,
    config: [
      {
        type: "interval",
        dayStart: "06:00:00",
        dayEnd: "23:59:00",
        nightStart: "23:59:00",
        nightEnd: "06:00:00",
        dayOnInterval: "06:00:00",
        dayOffInterval: "00:00:00",
        nightOnInterval: "00:10:00",
        nightOffInterval: "01:00:00",
      },
    ],
    arduino: "weather",
    isLock: !1,
  },
  3: {
    state: !1,
    config: [
      {
        type: "interval",
        dayStart: "06:00:00",
        dayEnd: "23:59:00",
        nightStart: "23:59:00",
        nightEnd: "06:00:00",
        dayOnInterval: "00:05:00",
        dayOffInterval: "00:25:00",
        nightOnInterval: "00:05:00",
        nightOffInterval: "01:00:00",
      },
    ],
    arduino: "weather",
    isLock: !1,
  },
  4: {
    state: !1,
    config: [
      {
        type: "interval",
        dayStart: "06:00:00",
        dayEnd: "23:59:00",
        nightStart: "23:59:00",
        nightEnd: "06:00:00",
        dayOnInterval: "00:05:00",
        dayOffInterval: "00:15:00",
        nightOnInterval: "00:05:00",
        nightOffInterval: "04:00:00",
      },
    ],
    arduino: "water",
    isLock: !1,
  },
  5: {
    arduino: "water",
    isLock: !1,
    config: [
      {
        type: "sensor",
        sensors: [
          { name: "phLevel", pin: 1, maxValue: 6.5, duration: "00:00:02", minValue: 7 },
          { name: "EC", pin: 2, maxValue: 1.55, duration: "00:00:02", minValue: 1.5 },
          { name: "waterLevel", pin: 3, maxValue: 0, duration: "00:00:30", minValue: 100 },
        ],
      },
    ],
    state: !1,
  },
  6: {
    isLock: !1,
    config: [{ type: "sensor", sensors: [{ name: "phLevel", pin: 1, maxValue: 6.5, duration: "00:00:02", minValue: 7 }] }],
    arduino: "water",
    state: !1,
  },
  7: {
    isLock: !1,
    config: [{ type: "sensor", sensors: [{ name: "EC", pin: 2, minValue: 1.2, maxValue: 0, duration: "00:00:02" }] }],
    arduino: "water",
    state: !1,
  },
};
cleanPins(),
  checkPins(),
  setInterval(() => {
    checkPins();
  }, 3e4);
