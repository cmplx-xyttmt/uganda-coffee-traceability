from django.contrib import admin
from leaflet.admin import LeafletGeoAdmin
from .models import CoffeeZone


@admin.register(CoffeeZone)
class CoffeeZoneAdmin(LeafletGeoAdmin):

    settings_overrides = {
        'DEFAULT_CENTER': (1.3733, 32.2903),
        'DEFAULT_ZOOM': 7,
    }
    list_display = ('gee_id', 'region_name', 'zone_type')
    search_fields = ('gee_id', 'region_name')
