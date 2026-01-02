import graphene
from django.contrib.gis.db import models


class CoffeeZone(models.Model):
    gee_id = models.CharField(max_length=50, unique=True)  # e.g "+21124-727"
    zone_type = models.IntegerField(null=True, help_text="Coffee presence probability from GEE")  # from 'zone'
    pixel_count = models.IntegerField(null=True)  # from 'count'

    # Metadata for the UI
    region_name = models.CharField(max_length=100, blank=True)

    # The core geospatial field
    # SRID 4326 is the standard WGS84 (GPS) coordinate system
    mpoly = models.MultiPolygonField(srid=4326)

    def __str__(self):
        return f"Plot {self.gee_id} ({self.region_name or 'Unknown Region'})"


class District(models.Model):
    name = models.CharField(max_length=100)
    pcode = models.CharField(max_length=10, blank=True)
    region = models.CharField(max_length=50, blank=True)  # adm1_name (e.g., Nothern)
    mpoly = models.MultiPolygonField(srid=4326)

    def __str__(self):
        return self.name
