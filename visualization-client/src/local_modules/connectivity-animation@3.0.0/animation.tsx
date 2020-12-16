import Kefir from "kefir";
import jStat from "jstat";

/*
interface IDataProvider{
	setUpFrequency(frequency_ms: float);
}

class DataProvider extends IDataProvider{
	private frequency_ms: float;
	private interval_handler: any;
	constructor(frequency_ms = 500) {
		this.setUpFrequency(frequency_ms);
		this.interval_handler = null;
	}
	public void start(){
		const self: IDataProvider = this;
		this.interval_handler = setInterval(() => {
			//self.
		});
	}
	public void setUpFrequency(frequency_ms: float){
		this.frequency_ms = frequency_ms;
	}
}
*/

/**
 * Frequency: In milliseconds
 */

interface IProviderAddress {
	address: string;
	port: number;
}

interface IProviderProps {
	frequency: number;
	maxConnections: number;
}

type ProviderSubscriber = (x: any) => void;

type SubscriptionType = "channels" | "timepoint" | "connectivity";

interface ISubscriber {
	[Key: SubscriptionType]: ProviderSubscriber[];
}

interface IConnection {
	configure: ((cmd: string, value: string) => void);
	start: (() => void);
	onstart: (() => void);
	onmessage: ((value: string) => void);
	onerror: ((msg: string) => void);
	send: ((cmd: string) => void);
}

const random_connection = (): IConnection => {
	const onstart = () => { }
	const onmessage = (value: string) => { }
	const onerror = (msg: string) => { }

	const configure = (cmd: string, value: string) => {
		console.log("Send cmd:", string, " value:", value);
	}
	const send = (cmd: string) => { }
	const start = () => {
		this.onstart();
		let index = 0;
		const caller = () => {
			const data = random_data_generator();
			const value = {}
			if(index == 0){
				value.type = "channels";
				value.value = data["channels"];
			}else{
				value.type = index % 2  == 1? "timepoint": "connectivity";
				value.value = data[value.type];
			}
			this.onmessage(JSON.stringify(value));
			setTimeout(caller, random_frequency());
		}
		setTimeout(caller, frequency);
	}

	const frequency: number = 500;
	const random_frequency = () => Math.max(300, Math.min(2000, frequency + jStat.normal.sample(0, 0.1)))
	const random_data_generator = () => ({
		channels: ["T3", "T4", "F3", "F4"],
		timepoint: [
			Array.from({ length: 4 }, (v, i) => jStat.normal.sample(0, 1)))
		],
		connectivity: [
			Array.from({ length: 16 }, (v, i) => [Math.floor(i / 4), i % 4, jStat.normal.sample(0, 1)])
		],
	})
	return { configure, start, send, onstart, onmessage, onerror }
};

const websocket_connection = (source: IProviderAddress): IConnection => {
	const onstart = () => { }
	const onmessage = (value: string) => { }
	const onerror = (msg: string) => { }

	const configure = (cmd: string, value: string) => { }
	const send = (cmd: string) => { }
	const start = () => { }

	return { configure, start, send, onstart, onmessage, onerror }
};

interface IProvider {
	subscribe: ((subscription_type: SubscriptionType, subscriber: ProviderSubscriber) => IProvider);
	execute: ((cmd: string) => IProvider);
}

export const provider = (connection: IConnection, { maxConnections: number = 100 }: IProviderProps = {}): IProvider => {
	const subscribers: Subscriber = {};
	subscribers["channels"] = [];
	subscribers["timepoint"] = [];
	subscribers["connectivity"] = [];

	const subscribe = (subscription_type: SubscriptionType, subscriber: ProviderSubscriber) => {
		console.log("subscribing", subscription_type, subscriber)
		subscribers[subscription_type] = subscriber;
		return { subscribe, execute }
	}

	const execute = (cmd: string) => {
		connection.execute(cmd);
	};

	connection.configure("max-connections", maxConnections.toString());
	connection.onmessage = (raw_value: string) => {
		const value = JSON.parse(raw_value);
		subscribers[value.type].forEach((v) => v(value.value))
		console.log(value);
	};

	return { subscribe, execute };
}

const app_provider = provider(random_connection(), { maxConnections: 1 }).subscribe("channels",
	(v) => {
		console.log(v)
	}).subscribe("timepoint",
		(v) => {
			console.log(v)
		}).subscribe("connectivity",
			(v) => {
				console.log(v)
			});

setTimeout(() => {
	app_provider.execute("stop");
}, 5000)