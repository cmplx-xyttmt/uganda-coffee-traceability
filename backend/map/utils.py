from django.db.models import OuterRef, Subquery
from .models import CoffeeZone, District


def link_coffee_to_districts():
    print("Starting spatial join... this may take a minute.")

    # We want to find a District that INTERSECTS the CoffeeZone
    # OuterRef('mpoly') refers to the geometry of the CoffeeZone currently being updated
    district_subquery = District.objects.filter(
        mpoly__intersects=OuterRef('mpoly')
    ).values('name')[:1]

    # Update all CoffeeZones at once
    count = CoffeeZone.objects.update(
        region_name=Subquery(district_subquery)
    )

    print(f"Successfully linked {count} coffee plots to their respective districts.")
