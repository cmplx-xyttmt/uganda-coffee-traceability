import {MapContainer, TileLayer, useMapEvents, Marker, Popup, GeoJSON, useMap} from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import {gql} from "@apollo/client";
import {useLazyQuery, useQuery} from "@apollo/client/react";
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

const GET_DISTRICT_BOUNDARIES = gql`
    query {
        allDistricts {
            name
            mpoly
        }
    }
`

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

function Map({onTraceResult, onDistrictClick, zones}) {
    const {loading, error, data: districtData} = useQuery(GET_DISTRICT_BOUNDARIES);
    const center = [1.3733, 32.2903]; // Center of Uganda

    const ZoomHandler = () => {
        const map = useMap();
        return null;
    }

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

            {districtData && (<GeoJSON
                data={districtData.allDistricts.map(d => JSON.parse(d.mpoly))}
                eventHandlers={{
                    click: (e) => {
                        const layer = e.propagatedFrom;

                        const name = layer.feature.properties.name;
                        onDistrictClick(name);

                        // Zoom in on the district
                        const bounds = layer.getBounds();
                        if(bounds.isValid()) {
                            e.target._map.flyToBounds(bounds, {
                                padding: [50, 50],
                                duration: 1.5,
                                easeLinearity: 0.25,
                                maxZoom: 12
                            });
                        }
                    }
                }}
                style={{
                    color: '#94a3b8',
                    weight: 1,
                    fillOpacity: 0.1,
                    fillColor: '#64748b'
                }}
            />)}

            {zones.length > 0 && (
                <GeoJSON
                    key={zones[0].id}
                    data={zones.map(z => JSON.parse(z.mpoly))}
                    style={{
                        color: '#4B3621',
                        weight: 1.5,
                        fillColor: '#6F4E37',
                        fillOpacity: 0.6
                    }}
                />
            )}
            <MapEventsHandler onResult={onTraceResult}/>
        </MapContainer>
    );
}

export default Map;
