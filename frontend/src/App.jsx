import './App.css';
import {useState} from "react";
import {useQuery} from "@apollo/client/react";
import {gql} from "@apollo/client";
import {LayoutDashboard, Map as MapIcon, ShieldCheck} from "lucide-react";
import Map from "./Map.jsx";

const GET_STATS = gql`
    query GetStats {
      summaryStats {
        totalPlots
        totalAreaSqMeters
      }
    }
`;

const GET_DISTRICT_ZONES = gql`
    query GetDistrictZones($name: String!) {
        allZones(districtName: $name) {
            geeId
            mpoly
        }
    }
`;

function App() {

    const {loading, error, data} = useQuery(GET_STATS);
    const [traceResult, setTraceResult] = useState(null);

    const [activeDistrict, setActiveDistrict] = useState(null);
    // Fetch Zones (only runs when activeDistrict is NOT null
    const {data: zoneData, loading: zonesLoading} = useQuery(GET_DISTRICT_ZONES, {
        variables: {name: activeDistrict || ""},
        skip: !activeDistrict,
    });

    const handleTraceResult = (result) => {
        setTraceResult((result));
    };

    return (
        <div className="flex h-screen w-full bg-slate-50 font-sans">
            {/* SIDEBAR */}
            <aside className="w-80 bg-white border-r border-slate-200 flex flex-col">
                <div className="p-6 border-b border-slate-100">
                    <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <ShieldCheck className="text-emerald-600"/>
                        CoffeeTrace UG
                    </h1>
                    <p className="text-xs text-slate-500 mt-1">EUDR Compliance Dashboard</p>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <div className="flex items-center gap-3 p-3 bg-emerald-50 text-emerald-700 rounded-lg font-medium">
                        <LayoutDashboard size={20}/>
                        Dashboard
                    </div>
                </nav>

                {activeDistrict && (
                    <div className="p-4 border-b bg-emerald-50">
                        <p className="text-xs font-bold text-emerald-600 uppercase">Viewing District</p>
                        <h2 className="text-xl font-bold">{activeDistrict}</h2>
                        <button
                            onClick={() => setActiveDistrict(null)}
                            className="text-xs text-slate-500 underline mt-1"
                        >
                            Clear filter
                        </button>
                        {zonesLoading && <p className="text-xs animate-pulse mt-2">Loading coffee plots...</p>}
                    </div>
                )}

                {/* TRACEABILITY RESULT CARD */}
                {traceResult && (
                    <div className={`m-4 p-4 rounded-xl border ${
                        traceResult.isEudrSafe
                            ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                            : "bg-amber-50 border-amber-200 text-amber-900"
                    }`}>
                        <h3 className="text-xs uppercase tracking-wider font-bold opacity-60">Verification Result</h3>
                        <div className="mt-2">
                            <p className="text-lg font-bold">{traceResult.status}</p>
                            <p className="text-sm mt-1">{traceResult.message}</p>
                            <p className="text-xs mt-2 font-medium">Region: {traceResult.region}</p>
                        </div>
                    </div>
                )}

                {traceResult && (
                    <div
                        className="m-4 p-5 bg-white border border-slate-200 rounded-2xl shadow-sm animate-in fade-in slide-in-from-bottom-4">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Regional Context</span>
                        </div>

                        <h2 className="text-2xl font-black text-slate-800 tracking-tight">
                            {traceResult.region || "Unknown District"}
                        </h2>

                        <div className="mt-4 grid grid-cols-2 gap-3">
                            <div className="p-3 bg-slate-50 rounded-lg">
                                <p className="text-[10px] text-slate-400 uppercase font-bold">Status</p>
                                <p className={`text-xs font-bold ${traceResult.isEudrSafe ? 'text-emerald-600' : 'text-amber-600'}`}>
                                    {traceResult.status}
                                </p>
                            </div>
                            <div className="p-3 bg-slate-50 rounded-lg">
                                <p className="text-[10px] text-slate-400 uppercase font-bold">Country</p>
                                <p className="text-xs font-bold text-slate-700">Uganda</p>
                            </div>
                        </div>

                        <p className="mt-4 text-[11px] leading-relaxed text-slate-500 italic border-l-2 border-slate-100 pl-3">
                            "This location falls within the {traceResult.region} administrative zone. 2020 baseline
                            analysis indicates established coffee production prior to EUDR cutoff."
                        </p>
                    </div>
                )}

                {/* SUMMARY STATS CARD */}
                <div className="p-4 bg-slate-900 m-4 rounded-xl text-white">
                    <h3 className="text-slate-400 text-xs uppercase tracking-wider font-semibold">National Overview</h3>
                    <div className="mt-4 space-y-4">
                        <div>
                            <p className="text-2xl font-bold">{loading ? "..." : data?.summaryStats.totalPlots.toLocaleString()}</p>
                            <p className="text-slate-400 text-xs">Total Detected Plots</p>
                        </div>
                        <div>
                            <p className="text-xl font-bold">
                                {loading ? "..." : (data?.summaryStats.totalAreaSqMeters / 1000000).toFixed(2)}
                            </p>
                            <p className="text-slate-400 text-xs">Total Area (sq km)</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* MAIN CONTENT / MAP */}
            <main className="flex-1 relative flex flex-col">
                <header className="h-16 bg-white border-b border-slate-200 flex items-center px-8 justify-between">
                    <span className="text-slate-600 font-medium">Uganda Satellite Analysis (2020 Baseline)</span>
                    <div className="flex gap-4">
                        <button
                            className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors">
                            Verify Coordinates
                        </button>
                    </div>
                </header>

                <div className="flex-1 bg-slate-200 relative">
                        <Map
                            onTraceResult={handleTraceResult}
                            onDistrictClick={setActiveDistrict}
                            zones={zoneData?.allZones || []}/>
                    </div>
            </main>

        </div>
    )
}

export default App
