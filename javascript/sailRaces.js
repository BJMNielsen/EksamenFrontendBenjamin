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
    tableRow.setAttribute("data-bs-toggle", "modal");
    tableRow.setAttribute("data-bs-target", "#sailRaceModal");
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
   // document.querySelector(`#deleteSailBoatKnap-${sailBoat.id}`).addEventListener('click', deleteSailRaces)
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
/*
    private int sailRaceId;

    private String sailRaceName;

    private LocalDate sailRaceDate;

    private int sailBoatId;

    private String sailBoatName;

    private String boatType;

    private int points;
 */

let tblBodySailRaceModal = document.querySelector("#tblBodySailRaceModal")

function fillRowsInModalTable(raceData){
    console.log(raceData)

    const tableRow = document.createElement("tr");
    // Vi giver hver table row et unikt id som er SailRacesRow-"id". Dette skal bruges til at slette hver row senere.
    tableRow.id = `sailRaceRow-${raceData.sailRaceId}`
    tableRow.innerHTML = `
        <td>${raceData.sailBoatId}</td>
        <td>${raceData.sailBoatName}</td>
        <td>${raceData.boatType}</td>
        <td>${raceData.points}</td>
        <td><button class="btn btn-primary" id="givePointsButton-${raceData.sailBoatId}" value="${raceData.sailBoatId}" data-bs-toggle="modal" data-bs-target="#givePointsModal">Give Points</button></td>
       
        `;
    // Vi appender én row ad gangen vi laver til vores tableBodySailRaces.
    tblBodySailRaceModal.appendChild(tableRow);
}