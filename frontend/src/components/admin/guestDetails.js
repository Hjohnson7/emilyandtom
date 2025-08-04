import InviteeCard from "./inviteeDetails"

const UserDetails = () => {
    return (
        <InviteeCard
  main={
    {
        "id": 1,
        "email": "arryjohnson@hotmail.co.uk",
        "fname": "Harry",
        "lname": "Johnson",
        "rsvped": true,
        "coming": true,
        "sent_invite": true,
        "quiz_response": false,
        "partner": {
            "id": 1,
            "name": "Nikki Taylor",
            "rsvped": true,
            "coming": false,
            "rsvp": {
                "id": 12,
                "timestamp": "2025-07-31T20:26:04.034934Z",
                "name": "Nikki Taylor",
                "arrival_day": "FRI",
                "purchasing_food": true,
                "favourite_song": "",
                "food_selection": "MEAT",
                "message": null,
                "room": 1,
                "allergies": [
                    {
                        "id": 2,
                        "name": "Wheat"
                    }
                ],
                "user": null,
                "partner": {
                    "id": 1,
                    "name": "Nikki Taylor",
                    "rsvped": true,
                    "coming": false
                },
                "child": null
            }
        },
        "children": [
            {
                "id": 2,
                "name": "Robin",
                "age": 3,
                "rsvped": true,
                "coming": true,
                "rsvp": {
                    "id": 11,
                    "timestamp": "2025-07-31T20:26:04.026953Z",
                    "name": "Robin",
                    "arrival_day": "FRI",
                    "purchasing_food": true,
                    "favourite_song": "",
                    "food_selection": "VEGAN",
                    "message": null,
                    "room": 2,
                    "allergies": [
                        {
                            "id": 3,
                            "name": "Nuts"
                        },
                        {
                            "id": 4,
                            "name": "Seafood"
                        }
                    ],
                    "user": null,
                    "partner": null,
                    "child": {
                        "id": 2,
                        "name": "Robin",
                        "age": 3,
                        "rsvped": true,
                        "coming": true
                    }
                }
            }
        ],
        "rsvps": [
            {
                "id": 14,
                "timestamp": "2025-08-01T17:44:38.739007Z",
                "name": "Harry Johnson",
                "arrival_day": "FRI",
                "purchasing_food": false,
                "favourite_song": "",
                "food_selection": "MEAT",
                "message": null,
                "room": null,
                "allergies": [
                    {
                        "id": 2,
                        "name": "Wheat"
                    }
                ],
                "user": {
                    "id": 1,
                    "email": "arryjohnson@hotmail.co.uk",
                    "full_name": "Harry Johnson",
                    "rsvped": true,
                    "coming": true
                },
                "partner": null,
                "child": null
            }
        ]
    }}
/>

    )
}

export default UserDetails