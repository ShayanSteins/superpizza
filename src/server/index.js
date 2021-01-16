const Server = require('./server.js')
const Router = require('./router.js')
const Database = require('./database.js')
const config = require('./config.json')

try {
  const serv = new Server()
    .registerDataBase(new Database(config.database))
    .registerRouter(new Router(config.server))
    .registerWebSocketServer()
    .start(config.server)

} catch (error) {
  throw error
}


//Algo recherche d'horaire
// let timeSlots = new Map([['18:10', 1], ['18:20', 0], ['18:30', 1], ['18:40', 0], ['18:50', 0], ['19:00', 1], ['19:10', 1], ['19:20', 1], ['19:30', 1], ['19:40', 0], ['19:50', 0]])
// let pile = ['18:10', '18:20', '18:30', '18:40', '18:50', '19:00', '19:10', '19:20', '19:30', '19:40', '19:50']


// getPossibleSlot(6)


// /**
//  * Renvoi une Map contenant l'ensemble des horaires possibles pour le retrait
//  * @param {Number} qtyPizzas : quantité de pizza pour la commande
//  * @returns {Map} availableSlot : Map contenant en clé l'ensemble des horaires possibles pour le retrait, et en valeur les horaires qui seront alors occupés pour chaque clé
//  */
// function getPossibleSlot(qtyPizzas) {
//   let availableSlot = new Map()
//   if (getEmptySlots().length >= qtyPizzas) { // Si il y au moins autant de slots disponibles que de pizzas en commande

//     for (let i = 0; i < pile.length - 1; i++) {

//       if (i + qtyPizzas <= pile.length) { // Si il y a suffisamment de slot suivant (si l'on est pas à la fin de la pile)
//         let isEnoughSpace = true
//         let studySlot = []
        
//         for (let y = i; y < i + qtyPizzas; y++) { // Vérifie si les 'qtyPizzas' slots suivants sont disponibles
//           if (timeSlots.get(pile[y])) {
//             isEnoughSpace = false
//             break
//           }
//           studySlot.push(pile[y])
//         }

//         if (isEnoughSpace) { // Si on a trouvé assez d'espace, on peut donc modifier les slots pour les occuper
//           availableSlot.set(studySlot[studySlot.length - 1], studySlot)
//         }
//       }
//     }
//   }
//   // console.log(JSON.stringify(Array.from(availableSlot)))
//   return availableSlot
// }
