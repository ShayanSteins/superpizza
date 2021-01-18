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
   * @returns {Array} changedSlots : tableau listant les nom des slots modifiés
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
   * @returns {Array} availableSlots: tableau contenant l'ensemble des horaires possibles
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
    return availableSlots
  }

  /**
 * Retourne tous les slots non occupé (sans commande) de this.timeslots
 * @returns {Array} emptySlots : tableau contenant les horaires diponibles
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
   * @returns {Map} mapObj : Map de résultats SQL
   */
  arrayDbRequestToMap(dbResult) {
    let mapObj = new Map()
    for (const iterator of dbResult) {
      mapObj.set(iterator.hour, iterator.used)
    }
    return mapObj
  }
}

module.exports = TimeManager