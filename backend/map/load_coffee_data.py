from pathlib import Path
from django.contrib.gis.utils import LayerMapping
from .models import CoffeeZone

# Connect Model fields to GeoJSON keys
coffeezone_mapping = {
    'gee_id': 'id',  # Maps to the "id" at the feature level
    'zone_type': 'zone',  # Maps to properties -> zone
    'pixel_count': 'count',  # Maps to properties -> count
    'mpoly': 'POLYGON',  # LayerMapping handles the Geometry automatically
}

geojson_file = Path(__file__).resolve().parent.parent / 'geo_data/Uganda_Coffee_Polygons.geojson'


def run(verbose=True):
    # Note: 'transform=False' because data is already in 4326 (WGS84)
    lm = LayerMapping(CoffeeZone, str(geojson_file), coffeezone_mapping, transform=False)
    lm.save(strict=True, verbose=verbose)
