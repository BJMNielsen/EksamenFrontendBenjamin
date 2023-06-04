document.addEventListener("DOMContentLoaded", runFetchAllSailRaces) // Når siden starter, så runner vi vores hovedmetode i vores script vi har kaldt runFetchAllSailRaceser.

// Vi skaffer vores table body
let tableBodySailBoats = document.querySelector("#tblBodySailRace")

// Det her er vores "init" metode. Den køre hele scriptet.
function runFetchAllSailRaces() {
    fetchAlleSailRaces()
}


function fetchAlleSailRaces() {
    fetchAny("sailraces", "GET", null).then(sailRaces => {
        console.log(sailRaces)
        // Vi fetcher Sailboats og hvis det er en success .then:
        sailRaces.forEach(sailRace => { // For hver sailboat i vores liste af sailboats gør vi følgende
            fillRowsInTable(sailRace)
        })
    }).catch(error => { // hvis vi får en error, catcher vi den og gør følgende:
        console.error(error);
    })
}

// Her fylder vi vores html tabel med SailRaces
function fillRowsInTable(sailRace) {
    console.log(sailRace)
    const tableRow = document.createElement("tr");
    // Vi giver hver table row et unikt id som er SailRacesRow-"id". Dette skal bruges til at slette hver row senere.
    tableRow.id = `sailRaceRow-${sailRace.id}`

    tableRow.innerHTML = `
        <td>${sailRace.id}</td>
        <td>${sailRace.name}</td>
        <td>${sailRace.sailRaceDate}</td>
       
        <td><button class="btn btn-primary" id="participants-${sailRace.id}" value="${sailRace.id}" data-bs-toggle="modal" data-bs-target="#sailRaceModal">Participants</button></td>
        <td><button class="btn btn-primary" id="deleteSailRaceKnap-${sailRace.id}" value="${sailRace.id}">Delete</button></td>
        `;

    // Vi appender én row ad gangen vi laver til vores tableBodySailRaces.
    tableBodySailBoats.appendChild(tableRow);

    // Vi laver en eventlistener på hver update knap der kalder addHiddenIdToInputField metoden, som adder SailRaces id til et hidden form input felt
    document.querySelector(`#participants-${sailRace.id}`).addEventListener('click', fetchAllParticipantsInRace)

    // Vi laver en eventListener på hver delete knap vi skaber.
    document.querySelector(`#deleteSailRaceKnap-${sailRace.id}`).addEventListener('click', deleteSailRaces)

    //document.querySelector(`#participants-${sailRace.id}`).addEventListener('click', storeSailRaceIdGlobally)

    document.querySelector(`#participants-${sailRace.id}`).addEventListener('click', fillDropDownWithSailBoats)
}


function fetchAllParticipantsInRace(event) {

    const raceIdFromParticipantButton = event.target.value
    "/boats/race/"

    tblBodySailRaceModal.innerHTML = ''; // vi sletter lige alt i listen først
    fetchAny(`raceparticipations/race/` + raceIdFromParticipantButton, "GET", null).then(raceparticipations => {
        document.querySelector("#tblBodySailRaceModal").innerHTML = ""
        console.log(raceparticipations)

        // Vi fetcher participants og hvis det er en success .then:
        raceparticipations.forEach(raceParticipation => { // For hver sailboat i vores liste af sailboats gør vi følgende
            fillRowsInShowParticipantsModalTable(raceParticipation)
        })
    }).catch(error => { // hvis vi får en error, catcher vi den og gør følgende:
        console.error(error);
    })
}


// Vores MODAL til når vi trykker "Participants", dvs den der viser participants for et bestemt ræs
function fillRowsInShowParticipantsModalTable(raceParticipation) {
    console.log(raceParticipation)

    const tableRow = document.createElement("tr");
    // Vi giver hver table row et unikt id som er SailRacesRow-"id". Dette skal bruges til at slette hver row senere.
    tableRow.id = `participantRow-${raceParticipation.id}`
    // TODO FIKS points
    tableRow.innerHTML = `
        <td>${raceParticipation.id}</td>
        <td>${raceParticipation.sailBoat.id}</td>
        <td>${raceParticipation.sailBoat.name}</td>
        <td>${raceParticipation.sailBoat.boatType}</td>
        <td>${raceParticipation.points}</td> 
        <td><button class="btn btn-primary" id="givePointsButton-${raceParticipation.id}" value="${raceParticipation.id}" data-bs-toggle="modal" data-bs-target="#givePointsModal">Assign Points</button></td>
        <td><button class="btn btn-primary" id="deleteParticipantButton-${raceParticipation.id}" value="${raceParticipation.id}">Delete</button></td>
        `;
    // Vi appender én row ad gangen vi laver til vores tableBodySailRaces.
    let tblBodySailRaceModal = document.querySelector("#tblBodySailRaceModal")
    tblBodySailRaceModal.appendChild(tableRow);

    document.querySelector(`#givePointsButton-${raceParticipation.id}`).addEventListener('click', storeRaceParticipationIdInModalBtn) // TODO FIKS SÅ DEN GIVER KORREKT POINT

    document.querySelector(`#deleteParticipantButton-${raceParticipation.id}`).addEventListener('click', deleteParticipant)

}

//TODO FIKS DELETE SAIL PARTICIPANT
function deleteParticipant(event) {
    const participantId = event.target.value
    fetchAny(`raceparticipation/${participantId}`, "DELETE", null).then(participant => {
        alert(`Participant med id: ${participantId} og navn: ${participant.sailBoat.name} er blevet slettet fra sejladset`);

        // Her bruger vi det unikke id hver table row har, til at få fat i vores row, og derefter slette det fra table body delen. På den måde er vores liste stadig sortet efter vi deleter elementer.
        const rowToDelete = document.querySelector(`#participantRow-${participantId}`)
        tblBodySailRaceModal.removeChild(rowToDelete);

    }).catch(error => {
        console.error(error)
    })
}




function storeRaceParticipationIdInModalBtn(event) {
    document.querySelector("#givePointsModalButton").value = event.target.value;
    // vores event er knap trykket, og fordi knappen er givet value == sailboat id, kan vi får fat i id'et
    //document.querySelector("#updateIdFormHiddenInput").value = sailBoatId; // man kunne honestly også bare have gemt vores event.target.value i en global variabel her, i stedet for i et hidden field. Nok nemmere.
}


// GIVE POINTS TO PARTICIPANT ////
document.querySelector("#givePointsModalButton").addEventListener('click', givePointsToParticipants)

function givePointsToParticipants(event) {

    const participantID = event.target.value
    console.log("HER ER RACE PARTICIPANT ID", participantID)

    const updatePointsModalForm = document.querySelector("#modalFormGivePoints");
    // Vores participant object har kun points lige nu
    const participationObject = preparePlainFormData(updatePointsModalForm);
    // Vi adder nu vores participant ID til den.
    participationObject.id = participantID;

    fetchAny("raceparticipation", "PUT", participationObject).then(participant => {
        console.log("Added points to: ", participant) // hvis det lykkedes log'er vi sailboat.
        alert("Added points to: " + participant.sailBoat.name)
        window.location.reload()
    }).catch(error => {
        console.error(error) // hvis det fejler log'er vi error.
    })
}

document.querySelector("#createSailRaceModalBtn").addEventListener('click', createSailRace)

//TODO Her har jeg lavet noget nyt
////////////////  CREATE A SAILRACE /////////////
function createSailRace() {
    const createModalForm = document.querySelector("#modalFormCreateSailRace")
    const sailRaceObjekt = preparePlainFormData(createModalForm) // vi laver alt input fra formen om til et javascript objekt.

    // Nu har vi de informationer vi skal bruge for at POST vores SailBoat. Vi indtaster url + fetchmetode + objekt vi gerne vil update.
    fetchAny("sailrace", "POST", sailRaceObjekt).then(sailRace => {
        console.log("Created sailrace: ", sailRace) // hvis det lykkedes log'er vi Sailboat.
        alert("Created sailrace: " + sailRaceObjekt.name)
        window.location.reload()
    }).catch(error => {
        console.error(error) // hvis det fejler log'er vi error.
    })
}


function deleteSailRaces(event) {
    const sailRaceId = event.target.value
    fetchAny(`sailrace/${sailRaceId}`, "DELETE", null).then(sailRace => {
        alert(`sailRace med id: ${sailRaceId} og navn: ${sailRace.name} er blevet slettet`);

        // Her bruger vi det unikke id hver table row har, til at få fat i vores row, og derefter slette det fra table body delen. På den måde er vores liste stadig sortet efter vi deleter elementer.
        const rowToDelete = document.querySelector(`#sailRaceRow-${sailRaceId}`)
        tableBodySailBoats.removeChild(rowToDelete);

    }).catch(error => {
        console.error(error)
    })
}


//TODO Her har jeg lavet noget nyt
// FYLD DROPDOWN MED SAILBOATS THAT CAN BE PICKED TO PARTICIPATE ///
async function fillDropDownWithSailBoats(event) {
    try {
        // Her sætter vi vores sail race id til en global værdi vi kan bruge til at create en race participation;
        const sailRaceId = event.target.value;
        sailRaceIdGlobal = sailRaceId;

        const sailBoats = await fetchAny("sailboats", "GET", null);

        const ddSailBoatParticipants = document.querySelector("#dd-sailRace-Participants")
        ddSailBoatParticipants.innerHTML = ""

        for (let sailBoat of sailBoats) {
            const sailBoatOption = document.createElement("option")
            sailBoatOption.textContent = sailBoat.name
            sailBoatOption.sailBoat = sailBoat;
            ddSailBoatParticipants.appendChild(sailBoatOption)
        }
    } catch (error) {
        console.error("Had an error while trying to set up the Sailboat form.")
        console.error(error)
    }
}

let sailRaceIdGlobal;

//TODO Her har jeg lavet noget nyt
function getSelectedSailBoat() {
    const ddParticipatingSailBoats = document.querySelector("#dd-sailRace-Participants")
    const errorMessage = "Du skal vælge en Sejlbåd!"
    const selectedSailboatIndex = ddParticipatingSailBoats.selectedIndex;
    if (selectedSailboatIndex >= 0) {
        return ddParticipatingSailBoats.options[selectedSailboatIndex].sailBoat;
    }
    alert(errorMessage)
    throw new Error(errorMessage)
}

document.querySelector("#add-participant-dd-button").addEventListener('click', createParticipant)

//TODO Her har jeg lavet noget nyt
async function createParticipant() {
    try {
        const sailBoat = getSelectedSailBoat(); // skaffer vores sailboat objekt fra dropdown med metoden
        let sailRaceId = sailRaceIdGlobal; // skaffer race id fra global variabel
        const sailRace = await fetchAny(`sailrace/${sailRaceId}`, "GET", null); // får fat i vores race object

        const newParticipant = {
            sailBoat: sailBoat,
            sailRace: sailRace,
        }

        const postedParticipant = await fetchAny("raceparticipation", "POST", newParticipant);
        console.log("Created race participation for boat: ", postedParticipant) // brug komma for at kunne se objketet, hvis vi bruger + viser den bare objekt objekt (som en string), i stedet for det reelle objekt.
        alert("Created race participation for boat: " + postedParticipant.sailBoat.name + " and for the race: " + newParticipant.sailRace.name);
        console.log(document.querySelector(`#participants-${sailRaceId}`))

        const addedParticipant = await fetchAny(`raceparticipation/${postedParticipant.id}`, "GET", null);
        
        //TODO MAKE MODAL REFRESH, COULDNT WITH ADDED LINES.
        // fillRowsInShowParticipantsModalTable(addedParticipant);

    } catch (error) {
        console.error(error)
    }
}

