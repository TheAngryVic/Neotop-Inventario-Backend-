const { response } = require("express");
const bcrypter = require("bcryptjs");
const { Modelo, Categoria, Bodega } = require("../models");

//pagination
const { calculateLimitAndOffset, paginate } = require("paginate-info");

const { Op } = require("sequelize");
const sequelize = require("sequelize");
const { parse } = require("dotenv");

//CargaMAsiva

const cargaMasivaModelo = async (req, res = response) => {

  //Objeto a recuperar
  const body = req.body;

  //Arrays tanto para modelo(nombre) y categoria(id) y sus validaciones
  let bodyModeloArray=[]
  let bodyCategoriaArray=[]

  body._value.forEach(e => {
    bodyCategoriaArray.push(e.categoria)
    bodyModeloArray.push(e.nombre)

  });

  try {
    let arrayIdCategoria=[]
    let arrayModelo=[]

    const idCategorias = await Categoria.findAll({
      attributes: ["id"],
      where: { estado: true },
      raw: true,
    })
    idCategorias.forEach(c => {
        arrayIdCategoria.push(c.id)
    });

    //Vamos a validar el id de las categorias
    let contadorCategoria = 0;

    for (let i = 0; i < bodyCategoriaArray.length; i++) {
      if (arrayIdCategoria.includes(parseInt(bodyCategoriaArray[i]))) {
        contadorCategoria++
      } else {
        console.log("No hay");
      }
      
    }

    if (contadorCategoria<bodyCategoriaArray.length) {
      return res.status(400).json({
        msg:"Una categoria no existe en la base de datos"
      })
    }

    //VAmos a validar si las categorias ya existen en la DB
    let repite=0;
    const modelosDb = await Modelo.findAll({
      attributes: ["nombre"],
      where: { estado: true },
      raw: true,
    })
    modelosDb.forEach(n => {
      arrayModelo.push(n.nombre)
    });

    for (let i = 0; i < bodyModeloArray.length; i++) {
      if (arrayModelo.includes(bodyModeloArray[i].toUpperCase())) {
        repite++
      } else {
        console.log("NO hay");
      }
      
    }

    if (repite>0) {
      return res.status(400).json({msg:"Datos ya existentes en la DB"})
    }else{
      body._value.forEach(row=>{
        Modelo.create({
          nombre:row.nombre.toUpperCase(),
          stock_minimo:row.stock_minimo,
          CategoriumId: row.categoria
        }) .then(r=>{
          return res.status(200).json({
            msg:"Funciona!"
            ,r
          })
        }).catch(e=>{
          return res.status(500).json({
            msg:e
          })
        })
      })
    }



  } catch (error) {
    res.status(500).json({
      msg:"Error inesperado, favor contactar con admin",
      error
    })
  }

};

//CRUD modelo

//Obtener todos los modelos - autenticado - todos los permisos

const obtenerModelos = async (req, res = response) => {
  const { currentPage = 1, pageSize = 5, filter, sorter, desc } = req.query;

  try {
    const count = await Modelo.count({
      where: { estado: true },
    });

    const { limit, offset } = calculateLimitAndOffset(currentPage, pageSize);

    let rows;

    if (filter) {
      rows = await Modelo.findAll({
        attributes: ["id", "nombre", "stock_minimo"],
        include: [{ model: Categoria, attributes: ["id", "nombre"] }],
        where: { estado: true, nombre: { [Op.like]: `%${filter}%` } },
      });
    } else {
      if (sorter) {
        let asc_desc = desc === "true" ? "DESC" : "ASC";

        rows = await Modelo.findAll({
          attributes: ["id", "nombre", "stock_minimo"],
          include: [{ model: Categoria, attributes: ["id", "nombre"] }],
          where: { estado: true },
          order: [[sequelize.col(sorter), asc_desc]],
          offset: offset,
          limit: limit,
        });
      } else {
        rows = await Modelo.findAll({
          attributes: ["id", "nombre", "stock_minimo"],
          include: [{ model: Categoria, attributes: ["id", "nombre"] }],
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

//Obtener modelo por id - autenticado - todos los permisos

const obtenerModelo = async (req, res = response) => {
  const { id } = req.params;

  const modelo = await Modelo.findByPk(id);
  res.status(200).json({ modelo });
};

//Crear modelos - autenticado - bodega solo

const crearModelos = async (req, res = response) => {
  //Recuperamos el nombre del body y lo guardaremos en mayusculas
  const { nombre, ...data } = req.body;

  data.nombre = nombre.toUpperCase();

  console.log(data);

  //Verificaremos si existe modelo en la DB
  const modeloDB = await Modelo.findOrCreate({
    where: { nombre: data.nombre },
    defaults: {
      nombre: data.nombre,
      stock_minimo: data.stock_minimo,
      CategoriumId: data.categoria,
    },
  }).then(([modelo_, created]) => {
    if (!created) {
      return res.status(400).json({
        msg: "Ya existe una modelo registrada con el nombre ingresado",
      });
    } else {
      const forzarAsync = async () => {
        let modelo = await Modelo.findByPk(modelo_.id, {
          include: [{ model: Categoria, attributes: ["id", "nombre"] }],
          where: { estado: true },
        });
        res.status(201).json(modelo);
      };
      forzarAsync();
    }
  });
};

//Actualizar modelos - autenticado - bodega solo

const actualizarModelos = async (req, res = response) => {
  const { id } = req.params;
  const { estado, usuario, ...data } = req.body;

  if (Object.entries(data).length === 0) {
    return res.status(500).json({ msg: "El objeto viene vacio" });
  }

  if (data.nombre) {
    data.nombre = data.nombre.toUpperCase();

    const existe = await Modelo.findAll({
      where: { nombre: data.nombre, [Op.not]: [{ id }] },
    });

    if (existe.length > 0) {
      return res
        .status(400)
        .json({ msg: `${data.nombre} ya existe en la base de datos` });
    }
  }

  try {
    const modelo = await Modelo.findByPk(id);
    const modelo_update = await modelo.update(
      {
        nombre: data.nombre,
        stock_minimo: data.stock_minimo,
        CategoriumId: data.categoria,
      },
      {
        where: id,
      }
    );

    res
      .status(200)
      .json({ msg: `Modelo ${modelo.id} actualizado`, modelo_update });
  } catch (error) {
    console.log(error);
  }
};

//borrar modelos - autenticado - bodega solo

const borrarModelos = async (req, res = response) => {
  const { id } = req.params;
  const { estado, usuario, ...data } = req.body;

  data.estado = false;

  // const modelo = await Modelo.findByIdAndUpdate(id, data, { new: true })
  //   .populate("usuario", "nombre")
  //   .populate("categoria", "nombre");

  try {
    const modelo = await Modelo.findByPk(id);
    const modelo_borrar = await modelo.update(data, {
      where: id,
    });

    res.status(200).json({ msg: `${modelo.nombre} eliminado`, modelo_borrar });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: error,
    });
  }
};

const comboModelo = async (req, res = response) => {
  const combo = await Modelo.findAll({
    attributes: ["id", "nombre"],
    where: { estado: true },
  });

  return res.json(combo);
};

module.exports = {
  actualizarModelos,
  borrarModelos,
  comboModelo,
  crearModelos,
  obtenerModelo,
  obtenerModelos,
  cargaMasivaModelo,
};
