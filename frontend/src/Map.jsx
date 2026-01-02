import {MapContainer, TileLayer, useMapEvents, Marker, Popup} from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import {gql} from "@apollo/client";
import {useLazyQuery} from "@apollo/client/react";
import {useEffect, useState} from "react";


const CHECK_TRACEABILITY = gql`
    query CheckTraceability($lat: Float!, $lng: Float!) {
        checkTraceability(lat: $lat, lng: $lng) {
            status
            isEudrSafe
            message
            region
        }
    }
`;

function MapEventsHandler({onResult}) {
    const [clickedPos, setClickedPos] = useState(null);
    const [checkTraceability, {data, loading}] = useLazyQuery(CHECK_TRACEABILITY);

    useEffect(() => {
        if (data && data.checkTraceability) {
            onResult(data.checkTraceability);
        }
    }, [data, onResult]);


    useMapEvents({
        click(e) {
            const {lat, lng} = e.latlng;
            setClickedPos({lat, lng});
            checkTraceability({variables: {lat, lng}});
        },
    });
    if (!clickedPos) return null;
    return (
        <Marker position={[clickedPos.lat, clickedPos.lng]}>
            <Popup>
                {loading ? (
                    <div className="flex items-center gap-2 py-1">
                        <div
                            className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-xs font-medium">Analyzing Satellite Data...</span>
                    </div>
                ) : data ? (
                    <div className="animate-in fade-in duration-300 p-1">
                        <strong className={data.checkTraceability.isEudrSafe ? "text-emerald-600" : "text-rose-600"}>
                            {data.checkTraceability.status}
                        </strong>
                        <p className="text-xs mt-1">{data.checkTraceability.message}</p>

                    </div>
                ) : null}
            </Popup>

        </Marker>
    )
}

function Map({onTraceResult}) {
    const center = [1.3733, 32.2903]; // Center of Uganda

    return (
        <MapContainer
            center={center}
            zoom={7}
            className="h-full w-full"
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapEventsHandler onResult={onTraceResult}/>
        </MapContainer>
    );
}

export default Map;
