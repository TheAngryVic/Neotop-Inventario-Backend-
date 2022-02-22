const { response } = require("express");
const { Bodega } = require("../models");
//pagination
const { calculateLimitAndOffset, paginate } = require("paginate-info");
const { Op } = require("sequelize");
const sequelize = require("sequelize");

//cargaMasiva

const cargaMasivaBodega = async (req, res = response) => {
  //Objeto a recuperar
  const body = req.body;
  // Array para los nombres de las categorias de Body
  let bodyArray = [];
  //Le pusheamos los valores
  body._value.forEach((e) => {
    bodyArray.push(e.nombre);
  });

  //Se buscan las bodegas existentes y las pasamos a
  let arrayBodega = [];
  const bodegaFull = Bodega.findAll({
    where: { estado: true },
    raw: true, //Raw para que no me haga formatos raros Sequelizer
  }).then((response) => {
    //Pasamos los nombres al Array para comparar
    response.forEach((element) => {
      arrayBodega.push(element.nombre);
    });

    //Aumentamos el contador de repetidos
    let repite = 0;

    for (let i = 0; i < bodyArray.length; i++) {
      if (arrayBodega.includes(bodyArray[i].toUpperCase())) {
        repite++;
      }
      else{
        console.log("no hay");
      }
      
    }
    
    //Si es mayor a 0 devolvemos error
    if (repite > 0) {
      res.status(400).json({
        msg: "Hay datos que ya existen en la base de datos, por favor revise los datos.",
      });
    } else {
     try {
      body._value.forEach((row) => {
        const bodegaDB = Bodega.create({
          nombre: row.nombre.toUpperCase(),
          local: row.local.toUpperCase()
        })
          .then((result) => {
            
          })
          .catch((err) => {
           
          });
      });

      res.status(200).json({
        msg: "Funciona!",
      });
     } catch (error) {
      res.status(500).json({
        msg: "Hubo un error inesperado, favor contactarse con administrador",
        error ,
      });
     }
    }

  
  });

};

const obtenerBodegas = async (req, res = response) => {
  const { currentPage = 1, pageSize = 5, filter, sorter, desc } = req.query;

  try {
    const count = await Bodega.count({
      where: { estado: true },
    });

    const { limit, offset } = calculateLimitAndOffset(currentPage, pageSize);

    let rows;
    if (filter) {
      //FILTROS
      rows = await Bodega.findAll({
        where: {  estado:true ,nombre: { [Op.like]: `%${filter}%` } },
      });
    } else {
      if (sorter) {
        let asc_desc = desc === "true" ? "DESC" : "ASC";
        //Vamos a preguntar si el 'sorter' es Cantidad
        rows = await Bodega.findAll({
          where: { estado: true },
          order: [[sequelize.col(sorter), asc_desc]],
          offset: offset,
          limit: limit,
        });
      } else {
        rows = await Bodega.findAll({
          where: { estado: true },
          order: [["nombre", "asc"]],
          offset: offset,
          limit: limit,
        });
      }
    }

    const meta = paginate(currentPage, count, rows, pageSize);

    return res.status(200).json({ rows, meta });
  } catch (error) {
    console.log(error);
  }
};

const obtenerBodega = async (req, res = response) => {
  const { id } = req.params;

  const bodega = await Bodega.findByPk(id);
  res.status(200).json({ bodega });
};

const crearBodega = async (req, res = response) => {
  const nombre = req.body.nombre.toUpperCase();
  const local = req.body.local.toUpperCase();

  //Generar data
  const data = {
    nombre,
    local,
  };
  const bodegaDB = await Bodega.findOrCreate({
    where: { nombre },
    defaults: {
      nombre: data.nombre,
      local: data.local,
    },
  }).then(([bodega, created]) => {
    if (!created) {
      return res.status(400).json({
        msg: "Ya existe una bodega registrada con el nombre ingresado",
      });
    } else {
      res.status(201).json(bodega);
    }
  });
};

const actualizarBodega = async (req, res = response) => {
  const { id } = req.params;
  const { estado, ...data } = req.body;

  if (Object.entries(data).length === 0) {
    return res.status(500).json({ msg: "El objeto viene vacio" });
  }

  if (data.nombre) {
    data.nombre = data.nombre.toUpperCase();
    // .json({ msg: `${data.nombre} ya existe en la base de datos` });
    // const existe = await Bodega.findOne({ nombre: data.nombre.toUpperCase() });
    const existe = await Bodega.findAll({
      where: { nombre: data.nombre.toUpperCase(), [Op.not]: [{ id }] },
    });

    if (existe.length > 0) {
      return res
        .status(400)
        .json({ msg: `${data.nombre} ya existe en la base de datos` });
    }
  }

  if (data.local) {
    data.local = data.local.toUpperCase();
  }

  try {
    const bodega = await Bodega.findByPk(id);
    const bodega_update = await bodega.update(data, {
      where: id,
    });
    res.status(200).json({
      msg: `Bodega ${bodega.id} actualizada`,
      bodega_update,
    });
  } catch (error) {
    console.log(error);
  }
};

const borrarBodega = async (req, res = response) => {
  const { id } = req.params;
  const { estado, usuario, ...data } = req.body;

  data.estado = false;

  try {
    const bodega = await Bodega.findByPk(id);
    const bodega_eliminar = await bodega.update(data, {
      where: id,
    });

    res.status(200).json({
      bodega_eliminar,
      msg: `bodega ${bodega.nombre} eliminado`,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: error,
    });
  }
};

const comboBodega = async (req, res = response) => {
  const combo = await Bodega.findAll(
    { attributes: ["id", "nombre"] },
    { where: { estado: true } },
    "uid nombre"
  );

  return res.json(combo);
};

module.exports = {
  actualizarBodega,
  borrarBodega,
  comboBodega,
  crearBodega,
  obtenerBodega,
  obtenerBodegas,
  cargaMasivaBodega
};
