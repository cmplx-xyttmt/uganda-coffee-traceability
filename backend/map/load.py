from pathlib import Path
from django.contrib.gis.utils import LayerMapping
from .models import CoffeeZone, District

# Connect Model fields to GeoJSON keys
coffeezone_mapping = {
    'gee_id': 'id',  # Maps to the "id" at the feature level
    'zone_type': 'zone',  # Maps to properties -> zone
    'pixel_count': 'count',  # Maps to properties -> count
    'mpoly': 'POLYGON',  # LayerMapping handles the Geometry automatically
}

coffee_geojson_file = Path(__file__).resolve().parent.parent / 'geo_data/Uganda_Coffee_Polygons.geojson'


def load_coffee_zones(verbose=True):
    # Note: 'transform=False' because data is already in 4326 (WGS84)
    lm = LayerMapping(CoffeeZone, str(coffee_geojson_file), coffeezone_mapping, transform=False)
    lm.save(strict=True, verbose=verbose)


district_mapping = {
    'name': 'adm2_name',
    'pcode': 'adm2_pcode',
    'region': 'adm1_name',
    'mpoly': 'MULTIPOLYGON',  # LayerMapping will wrap Polygons into MultiPolygons
}

district_geojson = Path(__file__).resolve().parent.parent / 'geo_data/uga_admin2.geojson'


def load_districts(verbose=True):
    lm = LayerMapping(District, str(district_geojson), district_mapping, transform=False)
    lm.save(strict=True, verbose=verbose)
