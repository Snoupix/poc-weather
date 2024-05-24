import { useEffect, useState } from "react";

import Loader from "./view/loader";
import Weather from "./view/Weather";

export default function App() {
    const [geolocation, setGeolocation] = useState<GeolocationPosition | null>(null);
    const [getPosError, setGetPosError] = useState<GeolocationPositionError | null>(null);

    // useEffect(() => {
    //     const watcher = navigator.geolocation.watchPosition(
    //         position => setGeolocation(position),
    //         error => setGetPosError(error),
    //         {
    //             timeout: 10000,
    //             enableHighAccuracy: false,
    //         }
    //     );
    //    
    //     return () => navigator.geolocation.clearWatch(watcher);
    // }, []);
    useEffect(() => {
        // TODO: The navigator watcher has some issues with my build of Firefox try to migrate it to a setInterval instead
        navigator.geolocation.getCurrentPosition(
            position => setGeolocation(position),
            error => setGetPosError(error),
            {
                timeout: 10000,
                enableHighAccuracy: false,
            }
        );
    }, []);

    useEffect(() => {
        if (getPosError != null) {
            console.error(getPosError);
        }
    }, [getPosError]);

	return (
		<main className="w-screen h-screen flex flex-col bg-emerald-800 text-sky-50 text-center font-semibold">
            <section className="m-auto xl:w-3/12 w-8/12">
                <h1 className="text-2xl mb-10">Simple weather app</h1>
                {
                    getPosError != null && getPosError.code != getPosError.TIMEOUT
                        ? <h2>An unexpected error occured: {getPosError!.message}</h2>
                        : null
                }
                {
                    getPosError == null && geolocation != null
                        ? <Weather lat={geolocation.coords.latitude} lon={geolocation.coords.longitude} time={new Date(geolocation.timestamp).toLocaleTimeString()} />
                        : <Loader />
                }
            </section>
		</main>
	);
}
