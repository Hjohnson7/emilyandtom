from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from invitations.models import Child, Partner, RSVP, Room
from rest_framework.response import Response
from rest_framework import status
from .serializers import RSVPSerializer

# Create your views here.

class InvitationView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        
        children_qs = Child.objects.filter(parent=user)
        partner = Partner.objects.filter(partner_main=user).first()

        partner_name = partner.name if partner else None
        
        user_rsvpd = user.rsvped
        partner_rsvpd = partner.rsvped if partner else None
        
        if user_rsvpd:
            user_invite = RSVP.objects.filter(user=user).first()
            user_rsvp_data = RSVPSerializer(user_invite).data

        if partner_rsvpd: 
            user_invite = RSVP.objects.filter(partner=partner).first()
            partner_rsvp_data = RSVPSerializer(user_invite).data

        children = []

        for child in children_qs:
            if child.rsvped:
                invite = RSVP.objects.filter(child=child).first()
                child_rsvp_data = RSVPSerializer(invite).data
            
            children.append(
                {
                    "id": child.pk,
                    "name": child.name, 
                    "age": child.age, 
                    "rsvpd": child.rsvped,
                    "details": child_rsvp_data if child.rsvped else None
                }
            )

        data = {
            "user": {
                "id": user.pk,
                "name": f"{user.fname} {user.lname}",
                "rsvpd": user_rsvpd,
                "details": user_rsvp_data if user_rsvpd else None
            },
            "partner": {
                "id": partner.pk,
                "name": partner_name,
                "rsvpd": partner_rsvpd,
                "details": partner_rsvp_data if partner_rsvpd else None
            },
            "children": children
        }

        return Response(data, status=status.HTTP_200_OK)


class AccommodationListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, format=None):
        rooms = Room.objects.all()
        data = []

        for room in rooms:
            occupants = RSVP.objects.filter(room=room).values_list("name", flat=True)

            data.append({
                "id": room.id,
                "name": room.name,
                "type": room.room_type,  # Gets readable label
                "total": room.capacity,
                "available": room.capacity - len(list(occupants)),
                "occupants": list(occupants),
                "selected": []
            })

        return Response(data)
