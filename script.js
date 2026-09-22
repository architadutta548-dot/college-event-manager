// ====================================
// EXPLORE EVENTS
// ====================================

const exploreButton =
    document.getElementById("exploreButton");

exploreButton.addEventListener("click", function () {

    document.getElementById("events").scrollIntoView({
        behavior: "smooth"
    });

});


// ====================================
// CURRENT EVENT + EDIT MODE
// ====================================

let currentEvent = "";
let editIndex = -1;


// ====================================
// EVENT DETAILS + REGISTRATION
// ====================================

function showDetails(name, date, location) {

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


// ====================================
// CLOSE REGISTRATION POPUP
// ====================================

function closeRegistration() {

    document.getElementById("registrationModal").style.display =
        "none";

}


// ====================================
// REGISTRATION FORM
// ====================================

const registrationForm =
    document.getElementById("registrationForm");

registrationForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const name =
        document.getElementById("studentName").value;

    const email =
        document.getElementById("studentEmail").value;

    const course =
        document.getElementById("studentCourse").value;

    let registrations =
        JSON.parse(localStorage.getItem("registrations")) || [];


    // EDIT REGISTRATION

    if (editIndex !== -1) {

        registrations[editIndex].name = name;
        registrations[editIndex].email = email;
        registrations[editIndex].course = course;

        localStorage.setItem(
            "registrations",
            JSON.stringify(registrations)
        );

        alert("✅ Registration updated successfully!");

        editIndex = -1;

    }


    // NEW REGISTRATION

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


    registrationForm.reset();

    closeRegistration();

    displayRegistrations();

});


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

    count.textContent =
        registrations.length;


    registrations.forEach(function (registration, index) {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>${registration.name}</td>

            <td>${registration.email}</td>

            <td>${registration.course}</td>

            <td>${registration.event}</td>

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

    currentEvent = registration.event;


    document.getElementById("formTitle").textContent =
        "Edit Registration";

    document.getElementById("formButton").textContent =
        "Update Registration";


    document.getElementById("selectedEvent").innerHTML =

        "✏️ Editing registration for:<br><br>" +

        "<strong>" +
        registration.event +
        "</strong>";


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

const eventSearch =
    document.getElementById("eventSearch");


eventSearch.addEventListener("input", function () {

    const searchText =
        eventSearch.value.toLowerCase();


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

});


// ====================================
// OPEN ADD EVENT FORM
// ====================================

function openEventForm() {

    document.getElementById("eventModal").style.display =
        "flex";

}


// ====================================
// CLOSE ADD EVENT FORM
// ====================================

function closeEventForm() {

    document.getElementById("eventModal").style.display =
        "none";

}


// ====================================
// ADD NEW EVENT
// ====================================

const eventForm =
    document.getElementById("eventForm");


eventForm.addEventListener("submit", function (event) {

    event.preventDefault();


    const name =
        document.getElementById("eventName").value.trim();


    const date =
        document.getElementById("eventDate").value;


    const location =
        document.getElementById("eventLocation").value.trim();


    const description =
        document.getElementById("eventDescription").value.trim();


    let events =
        JSON.parse(localStorage.getItem("events")) || [];


    // PREVENT DUPLICATE EVENT NAMES

    const duplicateEvent =
        events.some(function (existingEvent) {

            return existingEvent.name.toLowerCase() ===
                name.toLowerCase();

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


    alert("🎉 New event added successfully!");


    eventForm.reset();

    closeEventForm();

    displayCustomEvents();

});


// ====================================
// DISPLAY CUSTOM EVENTS
// ====================================

function displayCustomEvents() {

    const container =
        document.getElementById("eventContainer");


    // REMOVE OLD CUSTOM EVENT CARDS

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
                📅 ${event.date}
            </p>


            <p>
                📍 ${event.location}
            </p>


            <p>
                ${event.description}
            </p>


            <button
                class="details-button">

                View Details

            </button>

        `;


        const detailsButton =
            card.querySelector(".details-button");


        detailsButton.addEventListener(
            "click",
            function () {

                showDetails(
                    event.name,
                    event.date,
                    event.location
                );

            }
        );


        container.appendChild(card);

    });

}


// ====================================
// LOAD SAVED REGISTRATIONS
// ====================================

displayRegistrations();


// ====================================
// LOAD SAVED EVENTS
// ====================================

displayCustomEvents();