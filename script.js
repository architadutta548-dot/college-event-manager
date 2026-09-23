/* =========================================
   COLLEGE EVENT MANAGER - SCRIPT
========================================= */


/* =========================================
   DEFAULT EVENTS
========================================= */

const defaultEvents = [
    {
        name: "Tech Fest 2026",
        date: "10 October 2026",
        location: "College Auditorium",
        description:
            "Explore technology, coding, innovation and exciting technical activities.",
        status: "Registration Open",
        activities:
            "Coding competitions, technical quizzes, project exhibitions and technology challenges.",
        participants:
            "All interested college students can participate."
    },

    {
        name: "Cultural Fest",
        date: "18 October 2026",
        location: "College Ground",
        description:
            "Celebrate music, dance, drama, creativity and the cultural spirit of our college.",
        status: "Limited Seats",
        activities:
            "Dance, singing, drama, fashion events and other cultural performances.",
        participants:
            "Students interested in cultural activities can participate."
    },

    {
        name: "Sports Day",
        date: "25 October 2026",
        location: "Sports Ground",
        description:
            "Enjoy an exciting day of sports, competitions and teamwork.",
        status: "Registration Closed",
        activities:
            "Running, football, cricket, badminton and other sporting competitions.",
        participants:
            "College students who registered for the sports activities."
    }
];


/* =========================================
   LOCAL STORAGE
========================================= */

let registrations =
    JSON.parse(localStorage.getItem("registrations")) || [];

let customEvents =
    JSON.parse(localStorage.getItem("customEvents")) || [];


/* =========================================
   PAGE LOAD
========================================= */

document.addEventListener("DOMContentLoaded", function () {

    displayRegistrations();

    renderCustomEvents();

    setupSearch();

    setupRegistrationForm();

    setupAddEventForm();

});


/* =========================================
   REGISTRATION MODAL
========================================= */

let selectedEventName = "";

function openRegistration(eventName) {

    selectedEventName = eventName;

    document.getElementById("selectedEvent").textContent =
        eventName;

    document.getElementById("registrationModal")
        .classList.add("active");
}


function closeRegistrationModal() {

    document.getElementById("registrationModal")
        .classList.remove("active");

    document.getElementById("registrationForm").reset();

    selectedEventName = "";
}


/* =========================================
   EMAIL VALIDATION
========================================= */

function isValidEmail(email) {

    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    return emailPattern.test(email);

}


/* =========================================
   REGISTRATION FORM
========================================= */

function setupRegistrationForm() {

    const form =
        document.getElementById("registrationForm");

    form.addEventListener("submit", function (event) {

        event.preventDefault();


        const name =
            document.getElementById("studentName")
                .value.trim();

        const email =
            document.getElementById("studentEmail")
                .value.trim();

        const course =
            document.getElementById("studentCourse")
                .value.trim();


        /* Check empty fields */

        if (!name || !email || !course) {

            alert("Please fill in all fields.");

            return;
        }


        /* Check email format */

        if (!isValidEmail(email)) {

            alert(
                "Please enter a valid email address."
            );

            document.getElementById("studentEmail").focus();

            return;
        }


        /* Check duplicate registration */

        const duplicate =
            registrations.some(function (registration) {

                return (
                    registration.email.toLowerCase() ===
                    email.toLowerCase() &&
                    registration.event === selectedEventName
                );

            });


        if (duplicate) {

            alert(
                "You have already registered for this event with this email."
            );

            return;
        }


        /* Add registration */

        registrations.push({

            name: name,

            email: email,

            course: course,

            event: selectedEventName

        });


        localStorage.setItem(
            "registrations",
            JSON.stringify(registrations)
        );


        alert(
            "Registration successful for " +
            selectedEventName +
            "!"
        );


        displayRegistrations();

        closeRegistrationModal();

    });
}


/* =========================================
   DISPLAY REGISTRATIONS
========================================= */

function displayRegistrations() {

    const table =
        document.getElementById("registrationTable");

    const noRegistrations =
        document.getElementById("noRegistrations");


    table.innerHTML = "";


    if (registrations.length === 0) {

        noRegistrations.style.display = "block";

        return;

    }


    noRegistrations.style.display = "none";


    registrations.forEach(function (registration, index) {

        const row = document.createElement("tr");


        row.innerHTML = `

            <td>${escapeHTML(registration.name)}</td>

            <td>${escapeHTML(registration.email)}</td>

            <td>${escapeHTML(registration.course)}</td>

            <td>${escapeHTML(registration.event)}</td>

            <td>

                <button
                    class="edit-btn"
                    onclick="editRegistration(${index})"
                >
                    Edit
                </button>

                <button
                    class="delete-btn"
                    onclick="deleteRegistration(${index})"
                >
                    Delete
                </button>

            </td>

        `;


        table.appendChild(row);

    });

}


/* =========================================
   EDIT REGISTRATION
========================================= */

function editRegistration(index) {

    const registration = registrations[index];


    const newName = prompt(
        "Enter student name:",
        registration.name
    );

    if (newName === null) {
        return;
    }


    const newEmail = prompt(
        "Enter email:",
        registration.email
    );

    if (newEmail === null) {
        return;
    }


    /* Validate edited email */

    if (!isValidEmail(newEmail.trim())) {

        alert(
            "Please enter a valid email address."
        );

        return;
    }


    const newCourse = prompt(
        "Enter course:",
        registration.course
    );

    if (newCourse === null) {
        return;
    }


    registrations[index].name =
        newName.trim();

    registrations[index].email =
        newEmail.trim();

    registrations[index].course =
        newCourse.trim();


    localStorage.setItem(
        "registrations",
        JSON.stringify(registrations)
    );


    displayRegistrations();

    alert("Registration updated successfully.");

}


/* =========================================
   DELETE REGISTRATION
========================================= */

function deleteRegistration(index) {

    const confirmation =
        confirm(
            "Are you sure you want to delete this registration?"
        );


    if (!confirmation) {
        return;
    }


    registrations.splice(index, 1);


    localStorage.setItem(
        "registrations",
        JSON.stringify(registrations)
    );


    displayRegistrations();

}


/* =========================================
   EVENT DETAILS
========================================= */

function showEventDetails(eventName) {

    const event = findEvent(eventName);


    if (!event) {

        alert("Event details not found.");

        return;
    }


    document.getElementById("detailsTitle").textContent =
        event.name;

    document.getElementById("detailsDate").textContent =
        event.date;

    document.getElementById("detailsLocation").textContent =
        event.location;

    document.getElementById("detailsStatus").textContent =
        event.status;

    document.getElementById("detailsDescription").textContent =
        event.description;

    document.getElementById("detailsActivities").textContent =
        event.activities;

    document.getElementById("detailsParticipants").textContent =
        event.participants;


    document.getElementById("detailsModal")
        .classList.add("active");

}


function closeDetailsModal() {

    document.getElementById("detailsModal")
        .classList.remove("active");

}


/* =========================================
   FIND EVENT
========================================= */

function findEvent(eventName) {

    const defaultEvent =
        defaultEvents.find(function (event) {

            return event.name === eventName;

        });


    if (defaultEvent) {
        return defaultEvent;
    }


    const customEvent =
        customEvents.find(function (event) {

            return event.name === eventName;

        });


    if (customEvent) {

        return {

            name: customEvent.name,

            date: formatDate(customEvent.date),

            location: customEvent.location,

            description: customEvent.description,

            status: "Registration Open",

            activities:
                "Activities and details will be announced by the event organizers.",

            participants:
                "All eligible college students can participate."

        };

    }


    return null;
}


/* =========================================
   SEARCH EVENTS
========================================= */

function setupSearch() {

    const searchInput =
        document.getElementById("searchInput");


    searchInput.addEventListener("input", function () {

        const searchText =
            searchInput.value.toLowerCase().trim();


        const cards =
            document.querySelectorAll(".event-card");


        cards.forEach(function (card) {

            const title =
                card.querySelector("h3");


            if (!title) {
                return;
            }


            const eventName =
                title.textContent.toLowerCase();


            if (eventName.includes(searchText)) {

                card.style.display = "";

            } else {

                card.style.display = "none";

            }

        });

    });

}


/* =========================================
   ADD EVENT MODAL
========================================= */

function openAddEventModal() {

    document.getElementById("addEventModal")
        .classList.add("active");

}


function closeAddEventModal() {

    document.getElementById("addEventModal")
        .classList.remove("active");

    document.getElementById("addEventForm").reset();

}


/* =========================================
   ADD EVENT FORM
========================================= */

function setupAddEventForm() {

    const form =
        document.getElementById("addEventForm");


    form.addEventListener("submit", function (event) {

        event.preventDefault();


        const name =
            document.getElementById("newEventName")
                .value.trim();

        const date =
            document.getElementById("newEventDate")
                .value;

        const location =
            document.getElementById("newEventLocation")
                .value.trim();

        const description =
            document.getElementById("newEventDescription")
                .value.trim();


        if (!name || !date || !location || !description) {

            alert("Please fill in all fields.");

            return;
        }


        /* Prevent duplicate event names */

        const exists =
            defaultEvents.some(function (event) {

                return event.name.toLowerCase() ===
                    name.toLowerCase();

            }) ||

            customEvents.some(function (event) {

                return event.name.toLowerCase() ===
                    name.toLowerCase();

            });


        if (exists) {

            alert(
                "An event with this name already exists."
            );

            return;
        }


        const newEvent = {

            name: name,

            date: date,

            location: location,

            description: description

        };


        customEvents.push(newEvent);


        localStorage.setItem(
            "customEvents",
            JSON.stringify(customEvents)
        );


        renderCustomEvents();


        closeAddEventModal();


        alert(
            "New event added successfully!"
        );

    });

}


/* =========================================
   RENDER CUSTOM EVENTS
========================================= */

function renderCustomEvents() {

    const container =
        document.getElementById("eventContainer");


    document
        .querySelectorAll(".custom-event")
        .forEach(function (card) {

            card.remove();

        });


    customEvents.forEach(function (event) {

        const card =
            document.createElement("div");


        card.className =
            "event-card custom-event";


        card.innerHTML = `

            <div class="event-poster">

                <div class="custom-poster-content">

                    <span>📅</span>

                    <strong>
                        ${escapeHTML(event.name)}
                    </strong>

                    <small>
                        COLLEGE EVENT
                    </small>

                </div>

            </div>


            <div class="event-icon">
                📅
            </div>


            <div class="event-content">

                <div class="event-status open">
                    🟢 Registration Open
                </div>


                <h3>
                    ${escapeHTML(event.name)}
                </h3>


                <p class="event-info">
                    📅 ${escapeHTML(formatDate(event.date))}
                </p>


                <p class="event-info">
                    📍 ${escapeHTML(event.location)}
                </p>


                <p>
                    ${escapeHTML(event.description)}
                </p>


                <div class="event-actions">

                    <button
                        class="details-btn"
                        onclick="showEventDetails('${escapeAttribute(event.name)}')"
                    >
                        View Details
                    </button>


                    <button
                        class="register-btn"
                        onclick="openRegistration('${escapeAttribute(event.name)}')"
                    >
                        Register Now
                    </button>

                </div>

            </div>
        `;


        container.appendChild(card);

    });

}


/* =========================================
   FORMAT DATE
========================================= */

function formatDate(dateString) {

    if (!dateString) {
        return "";
    }


    const date =
        new Date(dateString + "T00:00:00");


    return date.toLocaleDateString(
        "en-GB",
        {
            day: "numeric",
            month: "long",
            year: "numeric"
        }
    );

}


/* =========================================
   ESCAPE HTML
========================================= */

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


function escapeAttribute(value) {

    return String(value)
        .replace(/\\/g, "\\\\")
        .replace(/'/g, "\\'");

}


/* =========================================
   CLOSE MODALS OUTSIDE CLICK
========================================= */

window.addEventListener("click", function (event) {

    const detailsModal =
        document.getElementById("detailsModal");

    const registrationModal =
        document.getElementById("registrationModal");

    const addEventModal =
        document.getElementById("addEventModal");


    if (event.target === detailsModal) {
        closeDetailsModal();
    }


    if (event.target === registrationModal) {
        closeRegistrationModal();
    }


    if (event.target === addEventModal) {
        closeAddEventModal();
    }

});
