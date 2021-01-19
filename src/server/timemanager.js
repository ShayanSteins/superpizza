class TimeManager {
  constructor() {
    this.timeslots = new Map()
    this.pile = []
  }

  init(datas) {
    for (const iterator of datas) {
      this.timeslots.set(iterator.hour, iterator.used)
      this.pile.push(iterator.hour)
    }
  }

  /**
   * Mets à jour les slots utilisés par la nouvelle commande
   * @param {Object} order : Objet contenant l'ensemble des informations de la nouvelle commande
   * @returns {Array} : tableau listant les nom des slots modifiés
   */
  setSlotUsed(order) {
    let changedSlots = []
    let index = this.pile.indexOf(order.timeSlot)
    for (let i = index; i > index - order.totalQty; i--) {
      this.timeslots.set(this.pile[i], 1)
      changedSlots.push(this.pile[i])
    }
    return changedSlots
  }

  /**
   * Récupère l'ensemble des horaires de retrait possibles pour une quantité de pizzas donnée
   * @param {Number} qtyPizzas : quantité de pizza pour la commande
   * @returns {Array} : tableau contenant l'ensemble des horaires possibles
   */
  getAvailableTimeSlots(qtyPizzas = 1) {
    let availableSlots = []
    if (this.getEmptySlots().length >= qtyPizzas) { // Si il y au moins autant de slots disponibles que de pizzas en commande

      for (let i = 0; i < this.pile.length; i++) {

        if (i + qtyPizzas <= this.pile.length) { // Si il y a suffisamment de slot suivant (si l'on est pas à la fin de la pile)
          let isEnoughSpace = true
          let studySlot = []

          for (let y = i; y < i + qtyPizzas; y++) { // Vérifie si les 'qtyPizzas' slots suivants sont disponibles
            if (this.timeslots.get(this.pile[y])) {
              isEnoughSpace = false
              break
            }
            studySlot.push(this.pile[y])
          }

          if (isEnoughSpace) { // Si on a trouvé assez d'espace
            availableSlots.push(studySlot[studySlot.length - 1]) // On ajoute le dernier slot, correspondant à l'horaire de retrait possible de la commande
          }
        }
      }
    }
    return this.checkCurrentHour(availableSlots)
  }

  /**
   * Supprime, dans un tableau d'horaire, ceux dont l'heure est déjà passée
   * @param {Array} arrTS : tableau d'horaire
   * @returns {Array} : tableau filtré avec les horaires possibles
   */
  checkCurrentHour(arrTS) {
    let newArr = []
    arrTS.forEach( timeslot => {
      let hour = new Date().toLocaleTimeString('fr-FR')

      // Si c'est avant 10h, on ajoute le zero avant, afin de pouvoir comparer les horaires en string
      if(hour.length < 8) hour = '0' + hour.substring(0,4)
      else hour = hour.substring(0,5)

      if (hour < timeslot) newArr.push(timeslot)
    })
    
    return newArr
  }

  /**
 * Retourne tous les slots non occupé (sans commande) de this.timeslots
 * @returns {Array} : tableau contenant les horaires diponibles
 */
  getEmptySlots() {
    let emptySlots = []
    for (const [time, available] of this.timeslots) {
      if (!available) emptySlots.push(time)
    }
    return emptySlots
  }

  /**
   * Transforme un Array de résultats SQL en Map (pour les timeslots)
   * @param {Array} dbResult : tableau des résultats d'une requête SQL 
   * @returns {Map} : Map de résultats SQL
   */
  arrayDbRequestToMap(dbResult) {
    let mapObj = new Map()
    for (const iterator of dbResult) {
      mapObj.set(iterator.hour, iterator.used)
    }
    return mapObj
  }

  /**
   * Formate le résultat de la requête SQL en un tableau (de tableau pour les pizzas)
   * @param {Array} dbResult : résultat de la requête SQL
   * @returns {Array} : Tableau formaté pour la mise à jour côté client
   */
  requestOrdToArray(dbResult) {
    let arr = []
    for (const line of dbResult) {
      let check = arr.find(el => el.idOrder == line.idOrder)
      if (check !== undefined) {
        check.pizzas.push({
          name: line.name,
          qty: line.qty
        })
      }
      else {
        arr.push({
          idOrder: line.idOrder,
          lastName: line.lastName,
          firstName: line.firstName,
          phone: line.phone,
          state: line.state,
          price: line.price,
          timeSlot: line.timeSlot,
          pizzas: [{
            name: line.name,
            qty: line.qty
          }]
        })
      }
    }
    return arr
  }
}

module.exports = TimeManager