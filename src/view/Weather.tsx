import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import Loader from "./loader";

// TODO: Move types to a "types" file
type WeatherProps = {
	lat: number;
	lon: number;
	time: string;
};

type WeatherData = {
	coord: {
		lon: number;
		lat: number;
	};
	weather: Array<{
		main: string;
		description: string;
	}>;
	base: string;
	main: {
		temp: number;
		feels_like: number;
		temp_min: number;
		temp_max: number;
		pressure: number;
		humidity: number;
		sea_level: number;
		grnd_level: number;
	};
	visibility: number;
	wind: {
		speed: number;
		deg: number;
		gust: number;
	};
	rain?:
		| {
				"1h": undefined | number;
				"3h": undefined | number;
		  }
		| undefined;
	snow?:
		| {
				"1h": undefined | number;
				"3h": undefined | number;
		  }
		| undefined;
	clouds: {
		all: number;
	};
	dt: number;
	sys: {
		type: number;
		id: number;
		country: string;
		sunrise: number;
		sunset: number;
	};
	timezone: number;
	id: number;
	name: string;
	cod: number;
};

const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;

async function getWeather(lat: WeatherProps["lat"], lon: WeatherProps["lon"]) {
	try {
		const res = await axios.get("https://api.openweathermap.org/data/2.5/weather", {
			params: {
				appid: API_KEY,
				units: "metric",
				lat,
				lon,
			},
		});

		return res.data as WeatherData;
	} catch (e) {
		console.error("Unexpected error on weather fetching: ", e);
	}
}

export default function Weather({ lat, lon, time }: WeatherProps) {
	const { isLoading, error, data } = useQuery({
		queryKey: [lat, lon],
		queryFn: () => getWeather(lat, lon),
	});

	if (error != null) {
		console.error(error);
		return <span className="text-red-500">Unexpected error: please check the console</span>;
	}

	if (isLoading || data == undefined) {
		return <Loader />;
	}

	return (
		<section className="xl:text-lg text-sm">
			<p>
				Current weather for your city: {data.name} ({data.sys.country})
			</p>
			<p>At: {time}</p>
			<p>
				Temp: {data.main.temp}°C ({data.main.temp_min}°C - {data.main.temp_max}°C)
			</p>
			<p>Wind speed: {data.wind.speed}M/s</p>
			<p>Wind direction: {data.wind.deg}deg</p>
			<p>Clouds: {data.clouds.all}%</p>
			<p>Humidity: {data.main.humidity}</p>
			<div>-</div>
			{data.weather.map((w, i) => (
				<p key={i}>
					{w.main} ({w.description})
				</p>
			))}
		</section>
	);
}
