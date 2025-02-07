let plusBtn = document.getElementById("plusButton");
const mobileContainer = document.querySelector(".mobile");
let tripDetailPage = document.getElementById("tripDetail");
let cancelBtn = document.getElementById("cancelButton");
let confirmBtn = document.getElementById("confirmButton");
let inputElement = document.querySelector("#tripDetail input"); 
let addBtn = document.getElementById("addButton");
let InputNamePage = document.querySelector(".inputNameBackground");
let CancelInputBtn = document.getElementById("cancelInputButton");
let ConfirmInputBtn = document.getElementById("confirmInputButton");
let InputPeopleName = document.getElementById("inputPeopleName");
const invitePeopleBorder = document.querySelector(".invitePeopleBorder");
let confirmTripName = document.getElementById('confirmTripName')
let addTripBackground = document.getElementsByClassName('addTripBackground')

let server = "http://localhost:3000"; // Server URL (HTTPS)

let inputTripName;
let inputPeopleNameVariable;
let peopleList = [];

window.onload = async () => {
    try {
        const res = await fetch(`${server}/api/LoadData`, {
            method: "GET",
            headers: {"Content-Type" : "application/json"}
        })
        if (!res.ok) {
            console.log("Error loading trips");
            return;
        }
        const trips = await res.json();
        console.log("Trips loaded:", trips);

        const showTripContainer = document.querySelector(".showTrip");
        showTripContainer.innerHTML = ""; // Clear previous content

        trips.forEach(trip => {
            const { tripName, peopleNameList } = trip;

            const tripDataDiv = document.createElement("div");
            tripDataDiv.classList.add("tripData");
            tripDataDiv.innerHTML = `
                <div class="nameTripFrame">
                    <h4>${tripName}</h4>
                    <h4>${new Date().toLocaleDateString()}</h4>
                </div>
                <div class="joinCountFrame">
                    <h4>Join: ${peopleNameList.length}</h4>
                    <button class="deleteTripButton"><i class="fa-solid fa-trash"></i></button>
                </div>
                <div class="invitePeopleFrame">
                    <div class="invitePeopleBorder">
                        <div>${peopleNameList.map(person => `<span>${person}</span>`).join(" , ")}</div>
                    </div>
                </div>
            `;

            showTripContainer.appendChild(tripDataDiv);
        });
    } catch (err) {
        console("Error unable to load data from the database: ",err)
    }
}


plusBtn.addEventListener("click", () => {
    tripDetailPage.style.display = "inline";
    mobileContainer.classList.add("blur-active");
    addTripBackground[0].style.height = "100px";
});

cancelBtn.addEventListener("click", () => {
    tripDetailPage.style.display = "none";
    mobileContainer.classList.remove("blur-active");
    inputElement.value = "";
    invitePeopleBorder.innerHTML = "";
});

confirmTripName.addEventListener('click', async () => {
    inputTripName = inputElement.value.trim();
    if (!inputTripName) {
        alert("Please enter a trip name!");
        return;
    }
    try {
        const response = await fetch(`${server}/api/trips`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ tripName: inputTripName }),
        });
        if (!response.ok) {
            alert("Please use another name!")
            inputElement.value = "";
            return
    }
    addTripBackground[0].style.height = "400px";
    } catch(err) {
        console.error(error);
    }
})
ConfirmInputBtn.addEventListener("click", async () => {
    inputPeopleNameVariable = InputPeopleName.value.trim();
    if (!inputPeopleNameVariable) {
        InputPeopleName.placeholder = "People name is required!";
        return;
    }
    try {
        const response = await fetch(`${server}/api/people`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: inputPeopleNameVariable , tripName: inputTripName}),
        });

        if (!response.ok) {
            console.log("Failed to save person");
            return
    }
    const { name , peopleNameList } = await response.json();

    const personDiv = document.createElement("div");
    personDiv.classList.add("peopleName");
    personDiv.innerHTML = `
    <h4>${name}</h4>
    <button class="deleteNameButton">
        <i class="fa-solid fa-delete-left"></i>
    </button>
`;
    invitePeopleBorder.appendChild(personDiv);
    } catch (error) {
        console.error(error);
    }
    // Reset input and close modal
    tripDetailPage.classList.remove("blur-active");
    InputNamePage.style.display = "none";
    InputPeopleName.value = "";
});


confirmBtn.addEventListener("click", async () => {
   try {
    const res = await fetch(`${server}/api/tripData`, {
        method: "POST",
        headers: { "Content-Type" : "application/json" },
        body: JSON.stringify({ tripName: inputTripName }),
    })
    if(!res.ok){
        throw new Error("Error to fetch data")
    }
    const { tripName , peopleNameList} = await res.json();

    const tripDataDiv = document.createElement("div");
        tripDataDiv.classList.add("tripData");
        tripDataDiv.innerHTML = `
        <div class="nameTripFrame">
            <h4>${tripName}</h4>
            <h4>${new Date().toLocaleDateString()}</h4>
        </div>
        <div class="joinCountFrame">
            <h4>Join: ${peopleNameList.length}</h4>
            <button class="deleteTripButton"><i class="fa-solid fa-trash"></i></i></button>
        </div>
        <div class="invitePeopleFrame">
            <div class="invitePeopleBorder">
                <div>${peopleNameList.map(person => `<span>${person}</span>`).join(" , ")}</div>
            </div>
        </div>
    `;
    const showTripContainer = document.querySelector(".showTrip");
    showTripContainer.appendChild(tripDataDiv);

    tripDetailPage.style.display = "none";
    mobileContainer.classList.remove("blur-active");
    inputElement.value = "";
    peopleList = [];
    invitePeopleBorder.innerHTML = ""; 
   } 
    catch (err) {
        console.error('Error fetching data:', err);
   }
});

// Add people name
addBtn.addEventListener("click", async () => {
    InputNamePage.style.display = "grid";
    tripDetailPage.classList.add("blur-active");
});

// Cancel adding a person
CancelInputBtn.addEventListener("click", () => {
    InputNamePage.style.display = "none";
    tripDetailPage.classList.remove("blur-active");
    InputPeopleName.value = "";
});

document.querySelector(".showTrip").addEventListener("click", async (event) => {
    if (event.target.closest(".deleteTripButton")) {
        const tripDiv = event.target.closest(".tripData"); // Get the trip container
        const tripName = tripDiv.querySelector(".nameTripFrame h4").innerText; // Get the trip name
        
        if (confirm(`Are you sure you want to delete the trip: ${tripName}?`)) {
            try {
                const res = await fetch(`${server}/api/trips/${tripName}`, {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                });

                if (!res.ok) {
                    throw new Error("Failed to delete trip");
                }

                tripDiv.remove(); // Remove from DOM
                console.log("Trip deleted successfully!");
            } catch (err) {
                console.error("Error deleting trip:", err);
            }
        }
    }
});
