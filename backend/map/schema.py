#  noqa
import graphene
from graphene_django import DjangoObjectType
from django.contrib.gis.geos import Point
from django.contrib.gis.db.models.functions import Area, Transform
from django.db.models import Sum
from .models import CoffeeZone, District


class TraceabilityResult(graphene.ObjectType):
    status = graphene.String()
    message = graphene.String()
    region = graphene.String()
    is_eudr_safe = graphene.Boolean()


class SummaryStats(graphene.ObjectType):
    total_plots = graphene.Int()
    total_area_sq_meters = graphene.Float()


class CoffeeZoneType(DjangoObjectType):
    class Meta:
        model = CoffeeZone
        fields = ("id", "gee_id", "zone_type", "region_name")


class DistrictType(DjangoObjectType):
    mpoly = graphene.String()  # define as string so we can send as raw GeoJSON

    class Meta:
        model = District
        fields = ("id", "name", "pcode", "region")

    def resolve_mpoly(self, info):
        if self.mpoly:
            simplified = self.mpoly.simplify(0.005, preserve_topology=True)
            return simplified.json
        return None


class Query(graphene.ObjectType):
    # Query to get ALL zones
    all_zones = graphene.List(CoffeeZoneType, district_name=graphene.String())

    # Traceability Query
    check_traceability = graphene.Field(
        TraceabilityResult,
        lat=graphene.Float(required=True),
        lng=graphene.Float(required=True)
    )

    summary_stats = graphene.Field(SummaryStats)

    all_districts = graphene.List(DistrictType)

    def resolve_all_zones(root, info, district_name=None):
        if district_name:
            return CoffeeZone.objects.filter(region_name=district_name)
        return CoffeeZone.objects.none()

    def resolve_check_traceability(root, info, lat, lng):
        user_point = Point(lng, lat, srid=4326)

        zone = CoffeeZone.objects.filter(mpoly__contains=user_point).first()

        if zone:
            return {
                "status": "COMPLIANT",
                "message": f"Point is within Coffee Zone {zone.gee_id}.",
                "region": zone.region_name,
                "is_eudr_safe": True
            }

        return {
            "status": "WARNING",
            "message": "Point is outside known 2020 coffee areas.",
            "is_eudr_safe": False
        }

    def resolve_summary_stats(root, info):
        count = CoffeeZone.objects.count()

        # 1. Transform to SRID 32636 (UTM Zone 36N) which uses meters
        # 2. Calculate Area
        # 3. Sum the results
        stats = CoffeeZone.objects.annotate(
            area_m=Area(Transform('mpoly', 32636))
        ).aggregate(total_area=Sum('area_m'))
        total_area = stats['total_area']

        return {
            "total_plots": count,
            "total_area_sq_meters": total_area.sq_m if total_area else 0
        }

    def resolve_all_districts(self, info):
        return District.objects.annotate(

        )


schema = graphene.Schema(query=Query)
