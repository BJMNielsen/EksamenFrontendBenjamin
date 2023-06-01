document.addEventListener("DOMContentLoaded", runFetchAllSailBoats) // Når siden starter, så runner vi vores hovedmetode i vores script vi har kaldt runFetchAllKandidater.

// Vi skaffer vores table body
let tableBodySailBoats = document.querySelector("#tblBodySailBoats")

// Det her er vores "init" metode. Den køre hele scriptet.
function runFetchAllSailBoats() {
    fetchAlleSailBoats()
}


function fetchAlleSailBoats() {
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

function deleteKandidat(event) {
    const sailBoatId = event.target.value
    fetchAny(`sailboat/${sailBoatId}`, "DELETE", null).then(sailBoat => {
        alert(`sailboat med id: ${sailBoatId} og navn: ${sailBoat.name} er blevet slettet`);

        // Her bruger vi det unikke id hver table row har, til at få fat i vores row, og derefter slette det fra table body delen. På den måde er vores liste stadig sortet efter vi deleter elementer.
        const rowToDelete = document.querySelector(`#sailBoatRow-${sailBoatId}`)
        tableBodySailBoats.removeChild(rowToDelete);

    }).catch(error => {
        console.error(error)
    })
}

let sailBoatIdGlobal;

function storeSailBoatIdGlobally(event) {
    sailBoatIdGlobal = event.target.value // vores event er knap trykket, og fordi knappen er givet value == sailboat id, kan vi får fat i id'et
    //document.querySelector("#updateIdFormHiddenInput").value = sailBoatId; // man kunne honestly også bare have gemt vores event.target.value i en global variabel her, i stedet for i et hidden field. Nok nemmere.
}

/////////////  UPDATE  /////////////
document.querySelector("#updateSailBoatModalBtn").addEventListener('click', updateSailBoat)

function updateSailBoat() {
    const updateModalForm = document.querySelector("#modalFormUpdateSailBoat")
    const sailBoatObjekt = preparePlainFormData(updateModalForm) // vi laver alt input fra formen om til et javascript objekt.
    const sailBoatId = sailBoatIdGlobal
    sailBoatObjekt.id = sailBoatId; // Vi sætter vores Objekts id til at være lig dette vores knaps id.

    // Nu har vi de informationer vi skal bruge for at PUT vores kandidat. Vi indtaster url + fetchmetode + objekt vi gerne vil update.
    fetchAny("sailboat", "PUT", sailBoatObjekt).then(sailBoat => {
        console.log("Updated sailboat: ", sailBoat) // hvis det lykkedes log'er vi Sailboat.
        alert("Updated sailboat: " + sailBoatObjekt.name)
        window.location.reload()
    }).catch(error => {
        console.error(error) // hvis det fejler log'er vi error.
    })
}


// Den her eventlistener kalder så metoden der laver sailBoat når man trykker på modal knappen "create sailboat".
document.querySelector("#createSailBoatModalBtn").addEventListener('click', createSailBoat)

////////////////  CREATE  /////////////
function createSailBoat() {
    const createModalForm = document.querySelector("#modalFormCreateSailBoat")
    const sailBoatObjekt = preparePlainFormData(createModalForm) // vi laver alt input fra formen om til et javascript objekt.

    // Nu har vi de informationer vi skal bruge for at POST vores kandidat. Vi indtaster url + fetchmetode + objekt vi gerne vil update.
    fetchAny("sailboat", "POST", sailBoatObjekt).then(sailBoat => {
        console.log("Created sailboat: ", sailBoat) // hvis det lykkedes log'er vi Sailboat.
        alert("Created sailboat: " + sailBoatObjekt.name)
        window.location.reload()
    }).catch(error => {
        console.error(error) // hvis det fejler log'er vi error.
    })
}
