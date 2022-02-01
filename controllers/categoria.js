const { response } = require("express");
const { Categoria, Modelo } = require("../models");

//obtenerCategorias - paginado - total - populate

const { calculateLimitAndOffset, paginate } = require("paginate-info");
const { Op } = require("sequelize");
const sequelize = require("sequelize");

const cargaMasiva = async (req, res = response) => {
  //Objeto a recuperar
  const body = req.body;
  // Array para los nombres de las categorias de Body
  let bodyArray = [];
  //Le pusheamos los valores
  body._value.forEach((e) => {
    bodyArray.push(e.nombre);
  });
  //Se buscan las categorias existentes y las pasamos a
  let arrayCategorias = [];
  const categoriasFull = Categoria.findAll({
    where: { estado: true },
    raw: true, //Raw para que no me haga formatos raros Sequelizer
  }).then((response) => {
    //Pasamos los nombres al Array para comparar
    response.forEach((element) => {
      arrayCategorias.push(element.nombre);
    });

    //Aumentamos el contador de repetidos
    let repite = 0;
    for (let index = 0; index < bodyArray.length; index++) {
      if (arrayCategorias.includes(bodyArray[index].toUpperCase())) {
        repite++
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
      body._value.forEach(row => {
        const categoriaDB = Categoria.create({
          nombre:row.nombre.toUpperCase()
        }).then((result) => {
          res.status(200).json({
            result,
            msg:"Funciona!"
          })
          console.log(result);
        }).catch((err) => {
          res.status(500).json({
            msg: "Hubo un error inesperado, favor contactarse con administrador",
            err
          });
        });

      });
      
    }
    console.log("Se repite alguno?", repite);

    console.log("Array categorias", arrayCategorias);
    console.log("bodyArray", bodyArray);
  });

  console.log(body._value);
};

const obtenerCategorias = async (req, res = response) => {
  const { currentPage, pageSize, filter, sorter, desc } = req.query;

  try {
    const count = await Categoria.count({ where: { estado: true } });

    const { limit, offset } = calculateLimitAndOffset(currentPage, pageSize);

    let rows;

    if (filter) {
      rows = await Categoria.findAll({
        where: { estado: true, nombre: { [Op.like]: `%${filter}%` } },
      });
    } else {
      if (sorter) {
        let asc_desc = desc === "true" ? "DESC" : "ASC";

        rows = await Categoria.findAll({
          where: { estado: true },
          order: [[sequelize.col(`${sorter}`), asc_desc]],
          offset: offset,
          limit: limit,
        });
      } else {
        rows = await Categoria.findAll({
          where: { estado: true },
          order: [[sequelize.col(`nombre`), "ASC"]],
          offset: offset,
          limit: limit,
        });
      }
    }

    const meta = paginate(currentPage, count, rows, pageSize);

    return res.status(200).json({
      rows,
      meta,
    });
  } catch (error) {
    console.log(error);
  }
};
//obtenerCategorias - populate  {}

const obtenerCategoria = async (req, res = response) => {
  const { id } = req.params;

  try {
    const categoria = await Categoria.findByPk(id);
    res.status(200).json({ categoria });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const crearCategoria = async (req, res = response) => {
  const nombre = req.body.nombre.toUpperCase();
  //generar data
  const data = {
    nombre,
  };

  const categoriaDB = await Categoria.findOrCreate({
    where: { nombre },
    defaults: {
      nombre: data.nombre,
    },
  }).then(([categoria, created]) => {
    if (!created) {
      return res.status(400).json({
        msg: "Ya existe una categoria registrada con el nombre ingresado",
      });
    } else {
      res.status(201).json(categoria);
    }
  });
};

//actualizar categoria

const actualizarCategoria = async (req, res = response) => {
  const { id } = req.params;
  const { estado, usuario, ...data } = req.body;

  if (Object.entries(data).length === 0) {
    return res.status(500).json({ msg: "El objeto viene vacio" });
  }

  if (data.nombre) {
    data.nombre = data.nombre.toUpperCase();

    console.log("NOmbre", data.nombre);

    const existe = await Categoria.findAll({
      where: { estado: true, nombre: data.nombre },
    });

    console.log("Existe", existe);
    if (existe.length > 0) {
      return res
        .status(400)
        .json({ msg: `${data.nombre} ya existe en la base de datos` });
    }
  }

  try {
    const categoria = await Categoria.findByPk(id);
    const categoria_update = await categoria.update(data, {
      where: id,
    });
    res.status(200).json({
      msg: `categoria ${categoria.id} actualizada`,
      categoria_update,
    });
  } catch (error) {
    console.log(error);
  }

  const categoria = await Categoria.findByIdAndUpdate(id, data, { new: true });

  res.status(200).json({
    categoria,
    msg: `Categoria ${categoria.nombre} actualizada`,
  });
};

//borrar categoria- estado:false

const borrarCategoria = async (req, res = response) => {
  const { id } = req.params;
  const { estado, ...data } = req.body;

  data.estado = false;

  try {
    const categoria = await Categoria.findByPk(id);
    const bodega_eliminar = await categoria.update(data, {
      where: id,
    });

    res.status(200).json({
      categoria,
      msg: `Categoria ${categoria.nombre} eliminado`,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: error,
    });
  }
};

const comboCategoria = async (req, res = response) => {
  const combo = await Categoria.findAll({
    attributes: ["id", "nombre"],
    where: { estado: true },
  });

  return res.json(combo);
};

module.exports = {
  actualizarCategoria,
  borrarCategoria,
  comboCategoria,
  crearCategoria,
  obtenerCategoria,
  obtenerCategorias,
  cargaMasiva,
};
