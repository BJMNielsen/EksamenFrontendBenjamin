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
       
        <td><button class="btn btn-primary" id="vælgSailRaceKnap-${sailRace.id}" value="${sailRace.id}" data-bs-toggle="modal" data-bs-target="#sailRaceModal">Participants</button></td>
        <td><button class="btn btn-primary" id="deleteSailRaceKnap-${sailRace.id}" value="${sailRace.id}">Delete</button></td>
        `;

    // Vi appender én row ad gangen vi laver til vores tableBodySailRaces.
    tableBodySailBoats.appendChild(tableRow);

    // Vi laver en eventlistener på hver update knap der kalder addHiddenIdToInputField metoden, som adder SailRaces id til et hidden form input felt
    document.querySelector(`#vælgSailRaceKnap-${sailRace.id}`).addEventListener('click', fetchAllSailBoatsInRace)

    // Vi laver en eventListener på hver delete knap vi skaber.
    document.querySelector(`#deleteSailRaceKnap-${sailRace.id}`).addEventListener('click', deleteSailRaces)

    document.querySelector(`#vælgSailRaceKnap-${sailRace.id}`).addEventListener('click', storeSailRaceIdGlobally)
}

let sailRaceIdGlobal;

function storeSailRaceIdGlobally(event) {
    sailRaceIdGlobal = event.target.value // vores event er knap trykket, og fordi knappen er givet value == sailboat id, kan vi får fat i id'et
    //document.querySelector("#updateIdFormHiddenInput").value = sailBoatId; // man kunne honestly også bare have gemt vores event.target.value i en global variabel her, i stedet for i et hidden field. Nok nemmere.
}


function fetchAllSailBoatsInRace(event) {
    const raceIdFromRow = event.target.value
    tblBodySailRaceModal.innerHTML = ''; // vi sletter lige alt i listen først
    fetchAny(`boats/race/` + raceIdFromRow, "GET", null).then(dataFromRaces => {
        console.log(dataFromRaces)
        // Vi fetcher Sailboats og hvis det er en success .then:
        dataFromRaces.forEach(dataFromRace => { // For hver sailboat i vores liste af sailboats gør vi følgende
            fillRowsInModalTable(dataFromRace)
        })
    }).catch(error => { // hvis vi får en error, catcher vi den og gør følgende:
        console.error(error);
    })
}


let tblBodySailRaceModal = document.querySelector("#tblBodySailRaceModal")

function fillRowsInModalTable(raceData) {
    console.log(raceData)

    const tableRow = document.createElement("tr");
    // Vi giver hver table row et unikt id som er SailRacesRow-"id". Dette skal bruges til at slette hver row senere.
    tableRow.id = `sailBoatRow-${raceData.sailBoatId}`
    tableRow.innerHTML = `
        <td>${raceData.sailBoatId}</td>
        <td>${raceData.sailBoatName}</td>
        <td>${raceData.boatType}</td>
        <td>${raceData.points}</td>
        <td><button class="btn btn-primary" id="givePointsButton-${raceData.sailBoatId}" value="${raceData.sailBoatId}" data-bs-toggle="modal" data-bs-target="#givePointsModal">Give Points</button></td>
        <td><button class="btn btn-primary" id="deleteParticipantButton-${raceData.sailBoatId}" value="${raceData.sailBoatId}">Delete</button></td>
        `;
    // Vi appender én row ad gangen vi laver til vores tableBodySailRaces.
    tblBodySailRaceModal.appendChild(tableRow);

    document.querySelector(`#givePointsButton-${raceData.sailBoatId}`).addEventListener('click', storeSailBoatIdGlobally)

    document.querySelector(`#deleteParticipantButton-${raceData.sailBoatId}`).addEventListener('click', deleteParticipant)

}

function deleteParticipant(event) {
    const participantSailBoatId = event.target.value
    fetchAny(`sailboat/${participantSailBoatId}`, "DELETE", null).then(sailBoat => {
        alert(`sailboat med id: ${participantSailBoatId} og navn: ${sailBoat.name} er blevet slettet`);

        // Her bruger vi det unikke id hver table row har, til at få fat i vores row, og derefter slette det fra table body delen. På den måde er vores liste stadig sortet efter vi deleter elementer.
        const rowToDelete = document.querySelector(`#sailBoatRow-${participantSailBoatId}`)
        tblBodySailRaceModal.removeChild(rowToDelete);

    }).catch(error => {
        console.error(error)
    })
}


let sailBoatIdGlobal;

function storeSailBoatIdGlobally(event) {
    sailBoatIdGlobal = event.target.value // vores event er knap trykket, og fordi knappen er givet value == sailboat id, kan vi får fat i id'et
    //document.querySelector("#updateIdFormHiddenInput").value = sailBoatId; // man kunne honestly også bare have gemt vores event.target.value i en global variabel her, i stedet for i et hidden field. Nok nemmere.
}


// GIVE POINTS TO PARTICIPANT ////
document.querySelector("#givePointsModalButton").addEventListener('click', givePointsToParticipants)

function givePointsToParticipants() {
    /*
    let sailboat = fetchAny("sailboat/" + sailBoatIdGlobal, "GET", null).then(sailBoat => {
        console.log("Fetched: ", sailBoat) // hvis det lykkedes log'er vi sailboat.
    }).catch(error => {
        console.error(error) // hvis det fejler log'er vi error.
    })
    */
    const sailBoatObjectIdAndPoints = {
        id: null, // Replace `boatId` with the actual boat ID you want to update
        points: null // Replace `newPoints` with the new points value from the form input
    };
    console.log("SAILBOAT ID: " + sailBoatIdGlobal)
    const updatePointsModalForm = document.querySelector("#modalFormGivePoints");
    const sailBoatObject = preparePlainFormData(updatePointsModalForm);
    sailBoatObject.id = sailBoatIdGlobal;
    sailBoatObjectIdAndPoints.id = sailBoatObject.id
    sailBoatObjectIdAndPoints.points = sailBoatObject.points

    console.log("Sailboat id :" + sailBoatObjectIdAndPoints.id)

    //sailBoatObject.id = sailBoatObjectData.id
    console.log("SAILBOAT OBJECT ID" + sailBoatObject.id)

    fetchAny("sailboat", "PUT", sailBoatObjectIdAndPoints).then(sailBoat => {
        console.log("Added points to: ", sailBoat) // hvis det lykkedes log'er vi sailboat.
        alert("Added points to: " + sailBoat.name)
        window.location.reload()
    }).catch(error => {
        console.error(error) // hvis det fejler log'er vi error.
    })
}

document.querySelector("#createSailRaceModalBtn").addEventListener('click', createSailRace)

////////////////  CREATE  /////////////
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


document.querySelector("#createParticipantModalButton").addEventListener('click', createParticipants)
document.querySelector("#createParticipantModalButton").addEventListener('click', createRaceParticipation)

let globalSailBoatObjekt;
////////////////  CREATE  /////////////
function createParticipants() {
    const createParticipantsModalForm = document.querySelector("#modalFormCreateParticipant")
    const sailBoatObjekt = preparePlainFormData(createParticipantsModalForm) // vi laver alt input fra formen om til et javascript objekt.
    globalSailBoatObjekt = sailBoatObjekt;
    // Nu har vi de informationer vi skal bruge for at POST vores SailBoat. Vi indtaster url + fetchmetode + objekt vi gerne vil update.
    fetchAny("sailboat", "POST", sailBoatObjekt).then(sailBoat => {
        console.log("Created sailboat: ", sailBoat) // hvis det lykkedes log'er vi Sailboat.
        alert("Created sailboat: " + sailBoatObjekt.name)
        window.location.reload()
    }).catch(error => {
        console.error(error) // hvis det fejler log'er vi error.
    })

}

function createRaceParticipation() {
    console.log("vi er nu inde i createRaceParti")
    let sailRaceObject;
    fetchAny("sailrace/" + sailRaceIdGlobal, "GET", null).then(sailRace => {
        sailRaceObject = {
            id: sailRace.id,
            name: sailRace.name,
            sailRaceDate: sailRace.sailRaceDate,
        };
        // Now you have the sailRace stored in the sailRaceObject
        console.log(sailRaceObject);
        // You can use the sailRaceObject as needed
    }).catch(error => {
        console.error(error) // hvis det fejler log'er vi error.
    })
    console.log("HERE IS THE OBJECTS: " + sailRaceObject + globalSailBoatObjekt);
    const raceParticipationObject = {
        sailBoat: globalSailBoatObjekt,
        sailRace: sailRaceObject,
        points: 0
    };

    fetchAny("raceparticipation", "POST", raceParticipationObject).then(raceParticipation => {
        console.log("Created raceparticipation: ", raceParticipation) // hvis det lykkedes log'er vi
    }).catch(error => {
        console.error(error) // hvis det fejler log'er vi error.
        console.log("DER var en error med raceparticipation oprettelsen")
    })
}


