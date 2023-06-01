document.addEventListener("DOMContentLoaded", runFetchAllSailRaces) // Når siden starter, så runner vi vores hovedmetode i vores script vi har kaldt runFetchAllKandidater.

// Vi skaffer vores table body
let tableBodySailBoats = document.querySelector("#tblBodySailRace")

// Det her er vores "init" metode. Den køre hele scriptet.
function runFetchAllSailRaces() {
    fetchAlleSailRaces()
}


function fetchAlleSailRaces() {
    fetchAny("sailboats", "GET", null).then(sailBoats => {
        console.log(sailBoats)
        // Vi fetcher Sailboats og hvis det er en success .then:
        sailBoats.forEach(sailBoat => { // For hver sailboat i vores liste af sailboats gør vi følgende
            fillRowsInTable(sailBoat)
        })
    }).catch(error => { // hvis vi får en error, catcher vi den og gør følgende:
        console.error(error);
    })
}

// Her fylder vi vores html tabel med kandidater
function fillRowsInTable(sailBoat) {
    console.log(sailBoat)
    const tableRow = document.createElement("tr");
    // Vi giver hver table row et unikt id som er kandidatRow-"id". Dette skal bruges til at slette hver row senere.
    tableRow.id = `sailBoatRow-${sailBoat.id}`

    tableRow.innerHTML = `
        <td>${sailBoat.id}</td>
        <td>${sailBoat.name}</td>
        <td>${sailBoat.boatType}</td>
        <td>${sailBoat.points}</td>
       
        <td><button class="btn btn-primary" id="updateSailBoatKnap-${sailBoat.id}" value="${sailBoat.id}" data-bs-toggle="modal" data-bs-target="#updateSailBoatModal">Update</button></td>
        <td><button class="btn btn-primary" id="deleteSailBoatKnap-${sailBoat.id}" value="${sailBoat.id}">Delete</button></td>
        `;

    // Vi appender én row ad gangen vi laver til vores tableBodyKandidater.
    tableBodySailBoats.appendChild(tableRow);

    // Vi laver en eventlistener på hver update knap der kalder addHiddenIdToInputField metoden, som adder kandidat id til et hidden form input felt
    document.querySelector(`#updateSailBoatKnap-${sailBoat.id}`).addEventListener('click', storeSailBoatIdGlobally)


    // Vi laver en eventListener på hver delete knap vi skaber.
    document.querySelector(`#deleteSailBoatKnap-${sailBoat.id}`).addEventListener('click', deleteKandidat)
}