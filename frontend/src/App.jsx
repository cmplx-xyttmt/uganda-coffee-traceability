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

function App() {

    const {loading, error, data} = useQuery(GET_STATS);
    const [traceResult, setTraceResult] = useState(null);

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
                    <div
                        className="flex items-center gap-3 p-3 text-slate-600 hover:bg-slate-50 rounded-lg cursor-pointer transition-all">
                        <MapIcon size={20}/>
                        Map Explorer
                    </div>
                </nav>

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
                    <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                        <Map onTraceResult={handleTraceResult}/>
                    </div>
                </div>
            </main>

        </div>
    )
}

export default App
