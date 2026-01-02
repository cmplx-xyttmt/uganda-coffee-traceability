from django.core.serializers import serialize
from django.http import HttpResponse
from .models import CoffeeZone


def coffee_geojson(request):
    data = serialize('geojson', CoffeeZone.objects.all()[:100], geometry_field='mpoly', fields=('gee_id', 'region_name'))
    return HttpResponse(data, content_type='application/json')
