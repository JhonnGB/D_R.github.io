const comboControllers = {};
const Combo = require('../models/Combo')

// Función para fusionar grupos y iconos únicos
function mergeGroupsAndIcons(combos) {
    const groupsAndIcons = [];
  
    combos.forEach(combo => {
      const groupAndIcon = { group: combo.group, icono: combo.icono };
  
      // Verifica si este grupo no se ha agregado previamente al arreglo
      if (!groupsAndIcons.some(item => item.group === groupAndIcon.group)) {
        groupsAndIcons.push(groupAndIcon);
      }
    });
  
    return groupsAndIcons;
  }

comboControllers.findCombos = async (req, res, next) => {
    try {
        const combos = await Combo.find();
        res.locals.combos = combos;
        const groupsAndIcons = mergeGroupsAndIcons(combos);
        res.locals.groupsAndIcons = groupsAndIcons;
        next();
    } catch (error) {
        console.error("Error al obtener los combos:", error);
        res.status(500).send("Error al obtener los combos");
    }
};

comboControllers.filterCombos = async (req, res, next) => {
  let selectedGroup = req.params.group || null; 
  const currentUrl = req.url;
  
  if (currentUrl === '/combos/anuncio') {
      console.log(currentUrl);
      res.locals.currentUrl = currentUrl;
  } else if (selectedGroup) {
      console.log(currentUrl);
      let combos = await Combo.find({ group: selectedGroup });
      res.locals.combos = combos;
  }

  res.render('pages/combos', { combos: res.locals.combos, groupsAndIcons: res.locals.groupsAndIcons, currentUrl: currentUrl, selectedGroup: selectedGroup });
  next();
}


module.exports = comboControllers;