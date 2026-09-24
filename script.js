/* =========================================
   COLLEGE EVENT MANAGER
   STUDENT WEBSITE
========================================= */

const API_URL = "http://localhost:3000";

let databaseEvents = [];
let selectedEventId = null;


/* =========================================
   DOM ELEMENTS
========================================= */

const eventContainer = document.getElementById("eventContainer");
const searchInput = document.getElementById("searchInput");
const noSearchResults = document.getElementById("noSearchResults");

const detailsModal = document.getElementById("detailsModal");
const registrationModal = document.getElementById("registrationModal");

const registrationForm = document.getElementById("registrationForm");

const selectedEventElement =
    document.getElementById("selectedEvent");

const detailsTitle =
    document.getElementById("detailsTitle");

const detailsDate =
    document.getElementById("detailsDate");

const detailsLocation =
    document.getElementById("detailsLocation");

const detailsStatus =
    document.getElementById("detailsStatus");

const detailsDescription =
    document.getElementById("detailsDescription");

const detailsActivities =
    document.getElementById("detailsActivities");

const detailsParticipants =
    document.getElementById("detailsParticipants");


/* =========================================
   START WEBSITE
========================================= */

document.addEventListener("DOMContentLoaded", function () {

    loadEvents();

    setupSearch();

    setupRegistrationForm();

});


/* =========================================
   LOAD EVENTS FROM MYSQL
========================================= */

async function loadEvents() {

    try {

        const response = await fetch(
            `${API_URL}/api/events`
        );

        if (!response.ok) {
            throw new Error("Unable to load events.");
        }

        databaseEvents = await response.json();

        renderEvents(databaseEvents);

    } catch (error) {

        console.error("Error loading events:", error);

        eventContainer.innerHTML = `
            <div class="event-error">
                <h3>Unable to load events</h3>
                <p>
                    Please make sure the backend server
                    is running at http://localhost:3000
                </p>
            </div>
        `;

    }

}


/* =========================================
   RENDER EVENTS
========================================= */

function renderEvents(events) {

    eventContainer.innerHTML = "";

    if (events.length === 0) {

        noSearchResults.style.display = "block";

        return;
    }

    noSearchResults.style.display = "none";


    events.forEach(function (event) {

        const card = document.createElement("div");

        card.className = "event-card";


        const poster = getPoster(event.name);

        const statusClass = getStatusClass(event.status);

        const isClosed =
            event.status &&
            event.status.toLowerCase().includes("closed");


        card.innerHTML = `

            <img
                src="${poster}"
                alt="${escapeHTML(event.name)} poster"
                class="event-poster"
                onerror="this.src='https://via.placeholder.com/800x500?text=College+Event'"
            >

            <div class="event-info">

                <h3>
                    ${escapeHTML(event.name)}
                </h3>


                <div class="event-meta">

                    <span>
                        📅 ${formatDate(event.event_date)}
                    </span>

                    <span>
                        📍 ${escapeHTML(event.location)}
                    </span>

                </div>


                <p class="event-description">
                    ${escapeHTML(
                        event.description ||
                        "Join this exciting college event."
                    )}
                </p>


                <span class="status ${statusClass}">
                    ${escapeHTML(event.status || "Registration Open")}
                </span>


                <div class="event-actions">

                    <button
                        class="view-btn"
                        data-details-id="${event.id}"
                    >
                        View Details
                    </button>


                    <button
                        class="register-btn"
                        data-register-id="${event.id}"
                        ${isClosed ? "disabled" : ""}
                    >
                        ${isClosed ? "Registration Closed" : "Register Now"}
                    </button>

                </div>

            </div>
        `;


        eventContainer.appendChild(card);

    });


    setupEventButtons();

}


/* =========================================
   POSTER MAPPING
========================================= */

function getPoster(eventName) {

    const name = eventName.toLowerCase();


    if (name.includes("tech fest")) {
        return "tech-fest-poster.png";
    }


    if (name.includes("cultural fest")) {
        return "cultural-fest-poster.png";
    }


    if (name.includes("sports day")) {
        return "sports-day-poster.png";
    }


    return "https://via.placeholder.com/800x500?text=College+Event";
}


/* =========================================
   STATUS CLASS
========================================= */

function getStatusClass(status) {

    if (!status) {
        return "status-open";
    }

    const lowerStatus = status.toLowerCase();


    if (lowerStatus.includes("closed")) {
        return "status-closed";
    }


    if (
        lowerStatus.includes("limited") ||
        lowerStatus.includes("few")
    ) {
        return "status-limited";
    }


    return "status-open";
}


/* =========================================
   EVENT BUTTONS
========================================= */

function setupEventButtons() {

    const viewButtons =
        document.querySelectorAll("[data-details-id]");

    const registerButtons =
        document.querySelectorAll("[data-register-id]");


    viewButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            const eventId =
                Number(button.dataset.detailsId);

            openDetailsModal(eventId);

        });

    });


    registerButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            if (button.disabled) {
                return;
            }

            const eventId =
                Number(button.dataset.registerId);

            openRegistrationModal(eventId);

        });

    });

}


/* =========================================
   SEARCH
========================================= */

function setupSearch() {

    searchInput.addEventListener(
        "input",
        function () {

            const searchText =
                searchInput.value
                    .trim()
                    .toLowerCase();


            if (searchText === "") {

                renderEvents(databaseEvents);

                return;
            }


            const filteredEvents =
                databaseEvents.filter(function (event) {

                    const searchableText = `
                        ${event.name || ""}
                        ${event.location || ""}
                        ${event.description || ""}
                        ${event.status || ""}
                    `.toLowerCase();


                    return searchableText.includes(searchText);

                });


            renderEvents(filteredEvents);

        }
    );

}


/* =========================================
   EVENT DETAILS
========================================= */

function openDetailsModal(eventId) {

    const event =
        databaseEvents.find(function (item) {

            return Number(item.id) === Number(eventId);

        });


    if (!event) {
        return;
    }


    detailsTitle.textContent =
        event.name || "Event Details";


    detailsDate.textContent =
        formatDate(event.event_date);


    detailsLocation.textContent =
        event.location || "Not specified";


    detailsStatus.textContent =
        event.status || "Registration Open";


    detailsDescription.textContent =
        event.description ||
        "No description available.";


    detailsActivities.textContent =
        getActivities(event.name);


    detailsParticipants.textContent =
        "College students who meet the event requirements.";


    detailsModal.classList.add("show");

}


function closeDetailsModal() {

    detailsModal.classList.remove("show");

}


/* =========================================
   EVENT ACTIVITIES
========================================= */

function getActivities(eventName) {

    const name =
        (eventName || "").toLowerCase();


    if (name.includes("tech fest")) {

        return "Technical competitions, technology activities, projects and other technical events.";

    }


    if (name.includes("cultural fest")) {

        return "Dance, music, performances, cultural activities and creative programs.";

    }


    if (name.includes("sports day")) {

        return "Sports competitions, athletic activities and different outdoor games.";

    }


    return "Activities will be announced by the event organizers.";

}


/* =========================================
   REGISTRATION MODAL
========================================= */

function openRegistrationModal(eventId) {

    const event =
        databaseEvents.find(function (item) {

            return Number(item.id) === Number(eventId);

        });


    if (!event) {
        return;
    }


    if (
        event.status &&
        event.status.toLowerCase().includes("closed")
    ) {

        alert("Registration for this event is closed.");

        return;
    }


    selectedEventId =
        Number(event.id);


    selectedEventElement.textContent =
        event.name;


    registrationForm.reset();


    registrationModal.classList.add("show");

}


function closeRegistrationModal() {

    registrationModal.classList.remove("show");

    selectedEventId = null;

}


/* =========================================
   REGISTRATION FORM
========================================= */

function setupRegistrationForm() {

    registrationForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            if (!selectedEventId) {

                alert("Please select an event.");

                return;
            }


            const studentName =
                document
                    .getElementById("studentName")
                    .value
                    .trim();


            const studentEmail =
                document
                    .getElementById("studentEmail")
                    .value
                    .trim()
                    .toLowerCase();


            const studentCourse =
                document
                    .getElementById("studentCourse")
                    .value
                    .trim();


            if (
                studentName === "" ||
                studentEmail === "" ||
                studentCourse === ""
            ) {

                alert("Please fill in all fields.");

                return;
            }


            if (!isValidEmail(studentEmail)) {

                alert("Please enter a valid email address.");

                return;
            }


            const registrations =
                getRegistrations();


            const duplicate =
                registrations.some(function (registration) {

                    return (
                        registration.email === studentEmail &&
                        Number(registration.eventId) ===
                            Number(selectedEventId)
                    );

                });


            if (duplicate) {

                alert(
                    "You have already registered for this event with this email."
                );

                return;
            }


            const selectedEvent =
                databaseEvents.find(function (item) {

                    return Number(item.id) ===
                        Number(selectedEventId);

                });


            if (!selectedEvent) {

                alert("Event not found.");

                return;
            }


            const newRegistration = {

                id: Date.now(),

                studentName: studentName,

                email: studentEmail,

                course: studentCourse,

                eventId: Number(selectedEvent.id),

                eventName: selectedEvent.name,

                registeredAt:
                    new Date().toISOString()

            };


            registrations.push(newRegistration);


            localStorage.setItem(
                "registrations",
                JSON.stringify(registrations)
            );


            alert(
                `Registration successful for ${selectedEvent.name}!`
            );


            closeRegistrationModal();

        }
    );

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
   LOCAL STORAGE
========================================= */

function getRegistrations() {

    try {

        const saved =
            localStorage.getItem("registrations");


        if (!saved) {
            return [];
        }


        const registrations =
            JSON.parse(saved);


        return Array.isArray(registrations)
            ? registrations
            : [];

    } catch (error) {

        console.error(
            "Error reading registrations:",
            error
        );

        return [];

    }

}


/* =========================================
   DATE FORMAT
========================================= */

function formatDate(dateValue) {

    if (!dateValue) {
        return "Date not available";
    }


    const date =
        new Date(dateValue);


    if (isNaN(date.getTime())) {
        return dateValue;
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


/* =========================================
   HTML ESCAPE
========================================= */

function escapeHTML(value) {

    const div =
        document.createElement("div");

    div.textContent =
        value ?? "";

    return div.innerHTML;

}


/* =========================================
   CLOSE MODALS WHEN CLICKING OUTSIDE
========================================= */

window.addEventListener(
    "click",
    function (event) {

        if (event.target === detailsModal) {

            closeDetailsModal();

        }


        if (event.target === registrationModal) {

            closeRegistrationModal();

        }

    }
);


/* =========================================
   ESC KEY CLOSES MODALS
========================================= */

document.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Escape") {

            closeDetailsModal();

            closeRegistrationModal();

        }

    }
);
