// ====================================
// COLLEGE EVENT MANAGER
// ====================================

let currentEvent = "";
let editIndex = -1;


// ====================================
// EXPLORE EVENTS
// ====================================

document.getElementById("exploreButton").addEventListener("click", function () {

    document.getElementById("events").scrollIntoView({
        behavior: "smooth"
    });

});


// ====================================
// EVENT DETAILS
// ====================================

function showEventDetails(
    name,
    date,
    location,
    description,
    activities,
    participants,
    status
) {

    document.getElementById("detailsEventName").textContent = name;

    document.getElementById("detailsEventDate").textContent = date;

    document.getElementById("detailsEventLocation").textContent = location;

    document.getElementById("detailsEventStatus").textContent = status;

    document.getElementById("detailsEventDescription").textContent =
        description;

    document.getElementById("detailsEventActivities").textContent =
        activities;

    document.getElementById("detailsEventParticipants").textContent =
        participants;

    document.getElementById("eventDetailsModal").style.display = "flex";

}


function closeEventDetails() {

    document.getElementById("eventDetailsModal").style.display = "none";

}


// ====================================
// REGISTRATION
// ====================================

function openRegistration(name, date, location) {

    currentEvent = name;

    editIndex = -1;

    document.getElementById("formTitle").textContent =
        "Event Registration";

    document.getElementById("formButton").textContent =
        "Register Now";

    document.getElementById("selectedEvent").innerHTML =
        "🎉 <strong>" + name + "</strong><br><br>" +
        "📅 Date: " + date + "<br>" +
        "📍 Location: " + location;

    document.getElementById("studentName").value = "";

    document.getElementById("studentEmail").value = "";

    document.getElementById("studentCourse").value = "";

    document.getElementById("registrationModal").style.display =
        "flex";

}


function closeRegistration() {

    document.getElementById("registrationModal").style.display =
        "none";

}


// ====================================
// SAVE REGISTRATION
// ====================================

document.getElementById("registrationForm").addEventListener(
    "submit",
    function (event) {

        event.preventDefault();

        const name =
            document.getElementById("studentName").value.trim();

        const email =
            document.getElementById("studentEmail").value.trim();

        const course =
            document.getElementById("studentCourse").value.trim();


        let registrations =
            JSON.parse(localStorage.getItem("registrations")) || [];


        // ====================================
        // CHECK DUPLICATE REGISTRATION
        // ====================================

        if (editIndex === -1) {

            const alreadyRegistered =
                registrations.some(function (registration) {

                    return (
                        registration.email.toLowerCase() ===
                        email.toLowerCase() &&

                        registration.event.toLowerCase() ===
                        currentEvent.toLowerCase()
                    );

                });


            if (alreadyRegistered) {

                alert(
                    "⚠️ You are already registered for this event!\n\n" +
                    "You cannot register for the same event twice."
                );

                return;
            }

        }


        // ====================================
        // EDIT EXISTING REGISTRATION
        // ====================================

        if (editIndex !== -1) {

            registrations[editIndex].name = name;

            registrations[editIndex].email = email;

            registrations[editIndex].course = course;

            localStorage.setItem(
                "registrations",
                JSON.stringify(registrations)
            );

            alert(
                "✅ Registration updated successfully!"
            );

            editIndex = -1;

        }


        // ====================================
        // NEW REGISTRATION
        // ====================================

        else {

            const registration = {

                name: name,

                email: email,

                course: course,

                event: currentEvent

            };


            registrations.push(registration);


            localStorage.setItem(
                "registrations",
                JSON.stringify(registrations)
            );


            alert(
                "🎉 Registration Successful!\n\n" +
                "Thank you, " + name + "!"
            );

        }


        document.getElementById("registrationForm").reset();

        closeRegistration();

        displayRegistrations();

    }
);


// ====================================
// DISPLAY REGISTRATIONS
// ====================================

function displayRegistrations() {

    const table =
        document.getElementById("registrationTable");

    const count =
        document.getElementById("registrationCount");


    const registrations =
        JSON.parse(localStorage.getItem("registrations")) || [];


    table.innerHTML = "";

    count.textContent = registrations.length;


    registrations.forEach(function (registration, index) {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>
                ${registration.name}
            </td>

            <td>
                ${registration.email}
            </td>

            <td>
                ${registration.course}
            </td>

            <td>
                ${registration.event}
            </td>

            <td>

                <button
                    class="edit-button"
                    onclick="editRegistration(${index})">

                    ✏️ Edit

                </button>


                <button
                    class="delete-button"
                    onclick="deleteRegistration(${index})">

                    🗑️ Delete

                </button>

            </td>

        `;


        table.appendChild(row);

    });

}


// ====================================
// EDIT REGISTRATION
// ====================================

function editRegistration(index) {

    const registrations =
        JSON.parse(localStorage.getItem("registrations")) || [];


    const registration =
        registrations[index];


    editIndex = index;

    currentEvent =
        registration.event;


    document.getElementById("formTitle").textContent =
        "Edit Registration";


    document.getElementById("formButton").textContent =
        "Update Registration";


    document.getElementById("selectedEvent").innerHTML =
        "✏️ Editing registration for:<br><br>" +
        "<strong>" + registration.event + "</strong>";


    document.getElementById("studentName").value =
        registration.name;


    document.getElementById("studentEmail").value =
        registration.email;


    document.getElementById("studentCourse").value =
        registration.course;


    document.getElementById("registrationModal").style.display =
        "flex";

}


// ====================================
// DELETE REGISTRATION
// ====================================

function deleteRegistration(index) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this registration?"
        );


    if (confirmDelete) {

        let registrations =
            JSON.parse(localStorage.getItem("registrations")) || [];


        registrations.splice(index, 1);


        localStorage.setItem(
            "registrations",
            JSON.stringify(registrations)
        );


        displayRegistrations();

    }

}


// ====================================
// EVENT SEARCH
// ====================================

document.getElementById("eventSearch").addEventListener(
    "input",
    function () {

        const searchText =
            this.value.toLowerCase();


        const eventCards =
            document.querySelectorAll(".event-card");


        eventCards.forEach(function (card) {

            const eventName =
                card.querySelector("h3")
                    .textContent
                    .toLowerCase();


            if (eventName.includes(searchText)) {

                card.style.display = "block";

            }

            else {

                card.style.display = "none";

            }

        });

    }
);


// ====================================
// ADD EVENT FORM
// ====================================

function openEventForm() {

    document.getElementById("eventModal").style.display =
        "flex";

}


function closeEventForm() {

    document.getElementById("eventModal").style.display =
        "none";

}


document.getElementById("eventForm").addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const name =
            document.getElementById("eventName")
                .value
                .trim();


        const date =
            document.getElementById("eventDate")
                .value;


        const location =
            document.getElementById("eventLocation")
                .value
                .trim();


        const description =
            document.getElementById("eventDescription")
                .value
                .trim();


        let events =
            JSON.parse(localStorage.getItem("events")) || [];


        const duplicateEvent =
            events.some(function (existingEvent) {

                return (
                    existingEvent.name.toLowerCase() ===
                    name.toLowerCase()
                );

            });


        if (duplicateEvent) {

            alert(
                "⚠️ An event with this name already exists."
            );

            return;
        }


        const newEvent = {

            name: name,

            date: date,

            location: location,

            description: description

        };


        events.push(newEvent);


        localStorage.setItem(
            "events",
            JSON.stringify(events)
        );


        alert(
            "🎉 New event added successfully!"
        );


        document.getElementById("eventForm").reset();

        closeEventForm();

        displayCustomEvents();

    }
);


// ====================================
// FORMAT DATE
// ====================================

function formatEventDate(dateString) {

    const date =
        new Date(dateString + "T00:00:00");


    if (Number.isNaN(date.getTime())) {

        return dateString;

    }


    return date.toLocaleDateString(
        "en-IN",
        {
            day: "numeric",
            month: "long",
            year: "numeric"
        }
    );

}


// ====================================
// DISPLAY CUSTOM EVENTS
// ====================================

function displayCustomEvents() {

    const container =
        document.getElementById("eventContainer");


    const oldCustomEvents =
        container.querySelectorAll(".custom-event");


    oldCustomEvents.forEach(function (card) {

        card.remove();

    });


    const events =
        JSON.parse(localStorage.getItem("events")) || [];


    events.forEach(function (event) {

        const card =
            document.createElement("div");


        card.className =
            "event-card custom-event";


        const formattedDate =
            formatEventDate(event.date);


        card.innerHTML = `

            <div class="event-icon">
                📅
            </div>


            <span class="event-status open">
                🟢 Registration Open
            </span>


            <h3>
                ${event.name}
            </h3>


            <p>
                📅 ${formattedDate}
            </p>


            <p>
                📍 ${event.location}
            </p>


            <p>
                ${event.description}
            </p>


            <div class="event-actions">

                <button class="details-button">
                    View Details
                </button>


                <button class="register-button">
                    Register Now
                </button>

            </div>

        `;


        const detailsButton =
            card.querySelector(".details-button");


        detailsButton.addEventListener(
            "click",
            function () {

                showEventDetails(

                    event.name,

                    formattedDate,

                    event.location,

                    event.description,

                    "Activities will be announced by the event organizers.",

                    "College students interested in this event.",

                    "Registration Open"

                );

            }
        );


        const registerButton =
            card.querySelector(".register-button");


        registerButton.addEventListener(
            "click",
            function () {

                openRegistration(

                    event.name,

                    formattedDate,

                    event.location

                );

            }
        );


        container.appendChild(card);

    });

}


// ====================================
// INITIAL LOAD
// ====================================

displayRegistrations();

displayCustomEvents();
