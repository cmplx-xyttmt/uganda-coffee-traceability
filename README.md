# 🇺🇬 Uganda Coffee Traceability & EUDR Compliance Tool
A full-stack geospatial application designed to verify coffee plot compliance with the European Union Deforestation Regulation (EUDR).

This tool leverages 10m-resolution satellite data from 2020 to provide a baseline for "Grandfathered" coffee production in Uganda.

You can read my approach to [this project here](https://cmplx-xyttmt.github.io/posts/4_coffee_traceability/).

## The Stack
- **Data**: Google Earth Engine (GEE), Python
- **Backend**: Django (GeoDjango), PostGIS (PostgreSQL 18), Graphene (GraphQL).
- **Frontend**: React (Vite), Apollo Client, Leaflet, Tailwind CSS v4.

## Key Features
- **10m Resolution Analysis**: Vectorized coffee presence data derived from Sentinel-2 satellite imagery.
- **Spatial "Drill-Down"**: Interactive administrative boundaries (Districts) that filter high-density plot data on-demand.
- **Point-in-Polygon Verification**: Real-time GraphQL traceability endpoint checking coordinate compliance against the 2020 baseline.
- **Spatial Statistics**: National-level area calculations using PostGIS transformations.

![dashboard-screenshot.png](..%2Fimages%2Fdashboard-screenshot.png)

## Installation & Setup
1. Database: Ensure PostGIS is installed (`brew install postgis`).
2. Backend:
```bash
pip install -r requirements.txt
python manage.py migrate
```
To load the data:
- Go to the Django shell: `python manage.py shell`
- `from map.load import load_coffee_zones, load_districts`
- `load_coffee_zones(); load_districts();`
3. Frontend:
```bash
cd frontend && npm install && npm run dev
```

