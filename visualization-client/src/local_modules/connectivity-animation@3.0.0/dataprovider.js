import Kefir from "kefir";
import jStat from "jstat";

export const random_connection = () => {
  const onstart = () => {}
  const onmessage = (value) => {}
  const onerror = (msg) => {}

  let retrieve_continue = true;
  const configure = (cmd, value) => {
    console.log("Send cmd:", cmd, " value:", value);
  }
  const send = (cmd) => {
    if (cmd == "stop") {
      retrieve_continue = false;
    }
  }
  const start = () => {
    self.onstart();
    let index = 0;
    const caller = () => {
      const data = random_data_generator();
      const value = {}
      if (index == 0) {
        value.type = "channels";
        value.value = data["channels"];
      } else {
        value.type = index % 2 == 1 ? "timepoint" : "connectivity";
        value.value = data[value.type];
      }
      self.onmessage(JSON.stringify(value));
      index++;
      if (retrieve_continue) setTimeout(caller, random_frequency());
    }
    setTimeout(caller, frequency);
  }

  const frequency = 500;
  const random_frequency = () => Math.max(300, Math.min(2000, frequency + jStat.normal.sample(0, 0.1)))
  const random_data_generator = () => ({
    channels: ["T3", "T4", "F3", "F4"],
    timepoint: [
      Array.from({ length: 4 }, (v, i) => jStat.normal.sample(0, 1))
    ],
    connectivity: [
      Array.from({ length: 16 }, (v, i) => [Math.floor(i / 4), i % 4, jStat.normal.sample(0, 1)])
    ],
  })
  let self = { configure, start, send, onstart, onmessage, onerror };
  return self;
};

export const websocket_connection = ({ server = "localhost", port = 9120 }) => {
  let socket = new WebSocket(`ws://${server}:${port}`, "ovar-protocol");
  window.socket_ = socket
  socket.onmessage = function(event) {
    try {
      self.onmessage(event.data);
    } catch (e) {
      console.error(e);
      console.error("#" + event.data);
    }
  }
  socket.onerror = (d) => self.onerror(d);
  socket.onopen = function(event) {
    self.onstart()
  };
  const onstart = () => {}
  const onmessage = (value) => {}
  const onerror = (msg) => {}

  const configure = (cmd, value = "") => {
    if (cmd == "close") {
      socket.send(JSON.stringify({
        command: cmd,
        value: value,
      }));
      setTimeout(() => socket.close(), 200);
    }
    const repetitions = ["pause", "stop"].includes(cmd) ? 1000 : 1;
    for (let i = 0; i < repetitions; i++) {
      socket.send(JSON.stringify({
        command: cmd,
        value: value,
      }));
    }
    if (["pause", "stop"].includes(cmd)) {
      setTimeout(() => {
        for (let i = 0; i < repetitions; i++) {
          socket.send(JSON.stringify({
            command: cmd,
            value: value,
          }));
        }
      }, 100);
      setTimeout(() => {
        for (let i = 0; i < repetitions; i++) {
          socket.send(JSON.stringify({
            command: cmd,
            value: value,
          }));
        }
      }, 150);
      setTimeout(() => {
        for (let i = 0; i < repetitions; i++) {
          socket.send(JSON.stringify({
            command: cmd,
            value: value,
          }));
        }
      }, 200);
      setTimeout(() => {
        for (let i = 0; i < repetitions; i++) {
          socket.send(JSON.stringify({
            command: cmd,
            value: value,
          }));
        }
      }, 250);
    }
    console.log("====CONFIG====")
    for (let i = 0; i < 100; i++)
      console.log(JSON.stringify({
        command: cmd,
        value: value,
      }))

  }
  const send = (cmd) => configure(cmd, "");
  const start = () => {
    send("start")
  }
  const ready = () => {
    return socket.readyState == 1
  }
  let self = { configure, start, send, onstart, onmessage, onerror, ready };
  return self;
};

export const dataprovider = (connection, properties = {}) => {
  const subscribers = {};
  subscribers["channels"] = [];
  subscribers["timepoint"] = [];
  subscribers["connectivity"] = [];

  const subscribe = (subscription_type, subscriber) => {
    console.log("subscribing", subscription_type, subscriber)
    if (!subscribers[subscription_type]) {
      subscribers[subscription_type] = []
    }
    subscribers[subscription_type].push(subscriber);
    return { subscribe, execute }
  }

  const execute = (cmd) => {
    connection.send(cmd);
  };

  connection.onmessage = (raw_value) => {
    const value = JSON.parse(raw_value);
    if (!subscribers[value.type]) {
      subscribers[value.type] = []
    }
    subscribers[value.type].forEach((v) => v(value.value))
    //console.log("Received", value);
  };

  const proper_start = () => {
    if (connection.ready()) {
      Object.keys(properties).forEach((prop) =>
        connection.configure(prop, properties[prop])
      )
      connection.start();
    } else {
      setTimeout(proper_start, 100);
    }
  }
  proper_start();

  return { subscribe, execute };
}