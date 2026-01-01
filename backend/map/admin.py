from django.contrib import admin
from leaflet.admin import LeafletGeoAdmin
from .models import CoffeeZone


@admin.register(CoffeeZone)
class CoffeeZoneAdmin(LeafletGeoAdmin):
    list_display = ('gee_id', 'region_name', 'zone_type')
    search_fields = ('gee_id', 'region_name')
