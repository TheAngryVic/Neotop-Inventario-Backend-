const { response } = require("express");
const {
  Categoria,
  Producto,
  Modelo,
  Bodega,
  Usuario,
  Movimiento,
} = require("../models");

const ObjectId = require("mongodb").ObjectId;

const { calculateLimitAndOffset, paginate } = require("paginate-info");
const { Op } = require("sequelize");
const sequelize = require("sequelize");

// Consultar esto en la base de datos si llega salir el error el modelo.id
// SET GLOBAL sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''));

//Carga masiva
const cargaMasivaProducto = async (req, res = response) => {
  //User
  const user = req.usuario.dataValues.id;
  //Objeto a recuperar
  const body = req.body;
  //Array para los modelos y validar si existen antes de insertar datos
  let bodyModeloArray = [];
  //Array para los bodegas y validar si existen antes de insertar datos
  let bodyBodegaArray = [];
  // Array para las nSerie de los productos de Body
  let bodyArray = [];
  //Le pusheamos los valores
  body._value.forEach((e) => {
    bodyArray.push(e.nSerie);
    bodyModeloArray.push(e.ModeloId);
    bodyBodegaArray.push(e.BodegaId);
  });

  try {
    let arrayidBodegas = [];
    let arrayidModelos = [];
    let arraySeries = [];
    const idBodegas = await Bodega.findAll({
      attributes: ["id"],
      where: { estado: true },
      raw: true,
    });
    idBodegas.forEach((b) => {
      arrayidBodegas.push(b.id);
    });
    const idModelo = await Modelo.findAll({
      attributes: ["id"],
      where: { estado: true },
      raw: true,
    });
    idModelo.forEach((m) => {
      arrayidModelos.push(m.id);
    });

    //Vamos a validar tanto las bodegas como los modelos (los id)
    let bodegaCount = 0;
    let modeloCount = 0;

    for (let step = 0; step < bodyBodegaArray.length; step++) {
      if (arrayidBodegas.includes(parseInt(bodyBodegaArray[step]))) {
        bodegaCount++;
      } else {
        console.log("NO hay");
      }
    }
    for (let step = 0; step < bodyModeloArray.length; step++) {
      if (arrayidModelos.includes(parseInt(bodyModeloArray[step]))) {
        modeloCount++;
      } else {
        console.log("NO hay");
      }
    }

    if (bodegaCount < bodyModeloArray.length) {
      return res.status(400).json({
        msg: "Una bodega no existe en la base de datos, por favor revise los datos",
      });
    }
    if (modeloCount < bodyModeloArray.length) {
      return res.status(400).json({
        msg: "Un modelo no existe en la base de datos, por favor revise los datos",
      });
    }

    //Validar si las nSerie no están en la base de datos
    const seriesProductosDB = await Producto.findAll({
      attributes: ["nSerie"],
      where: { estado: true },
      raw: true,
    });

    seriesProductosDB.forEach((s) => {
      arraySeries.push(s.nSerie);
    });
    //Aumentamos el contador de repetidos
    let repite = 0;
    for (let step = 0; step < bodyArray.length; step++) {
      if (arraySeries.includes(bodyArray[step].toUpperCase())) {
        repite++;
      } else {
        console.log("NO hay");
      }
    }

    if (repite > 0) {
      return res.status(400).json({
        msg: "Hay datos que ya existen en la base de datos, por favor revise los datos.",
      });
    } else {
      try {
        body._value.forEach((row) => {
          Producto.create({
            nSerie: row.nSerie.toUpperCase(),
            ModeloId: row.ModeloId,
            BodegaId: row.BodegaId,
            UsuarioId: user,
          })
            .then(async (r) => {
              let movimiento = await Movimiento.create({
                local_nuevo: bodegaName.nombre,
                fecha: Date.now(),
                ProductoId: r.id,
              });
            })
            .catch((e) => {});
        });

        return res.status(200).json({
          msg: "Funciona!",
        });
      } catch (error) {
        return res.status(500).json({
          msg: e,
        });
      }
    }

    console.log("Se repiten?", repite);
  } catch (error) {}
};

//Obtener combo
const selectProducto = async (req, res = response) => {
  const comboProductos = await Producto.findAll({
    attributes: ["id", "nSerie"],
    include: [
      {
        model: Modelo,
        attributes: ["nombre"],
      },
    ],
  });

  res.status(200).json(comboProductos);
};

const obetenerInventario = async (req, res = response) => {
  const { currentPage = 1, pageSize = 5, filter, sorter, desc } = req.query;

  try {
    const { limit, offset } = calculateLimitAndOffset(currentPage, pageSize);

    const rows_count = await Producto.findAll({
      attributes: [
        "Modelo.nombre",
        "Bodega.nombre",
        [sequelize.fn("COUNT", "Producto.Id"), "Cantidad"],
      ],
      include: [Modelo, Bodega],
      where: { estado: true },
      group: ["Modelo.nombre", "Bodega.nombre"],
      raw: true,
    });

    let rows;

    if (filter) {
      rows = await Producto.findAll({
        attributes: [
          "Modelo.nombre",
          "Bodega.nombre",
          [sequelize.fn("COUNT", "Producto.Id"), "Cantidad"],
        ],
        include: [Modelo, Bodega],
        where: { estado: true },
        having: {
          [Op.or]: [
            { "Modelo.nombre": { [Op.like]: `%${filter}%` } },
            { "Bodega.nombre": { [Op.like]: `%${filter}%` } },
          ],
        },
        group: ["Modelo.nombre", "Bodega.nombre"],
      });
    } else {
      if (sorter) {
        console.log("TRUE/FALSE", desc);
        let asc_desc = desc === "true" ? "DESC" : "ASC";

        //Vamos a preguntar si el 'sorter' es Cantidad
        let conOSinNombre =
          sorter == "Cantidad" ? "Cantidad" : `${sorter}.nombre`;
        rows = await Producto.findAll({
          attributes: [
            "Modelo.nombre",
            "Bodega.nombre",
            [sequelize.fn("COUNT", "Producto.Id"), "Cantidad"],
          ],
          include: [Modelo, Bodega],
          where: { estado: true },
          group: ["Modelo.nombre", "Bodega.nombre"],
          order: [[sequelize.col(conOSinNombre), asc_desc]],
          offset: offset,
          limit: limit,
        });
      } else {
        rows = await Producto.findAll({
          attributes: [
            "Modelo.nombre",
            "Bodega.nombre",
            [sequelize.fn("COUNT", "Producto.Id"), "Cantidad"],
          ],
          include: [Modelo, Bodega],
          where: { estado: true },
          group: ["Modelo.nombre", "Bodega.nombre"],
          order: [[sequelize.col("Cantidad"), "DESC"]],
          offset: offset,
          limit: limit,
        });
      }
    }

    const count = rows_count.length;

    const meta = paginate(currentPage, count, rows, pageSize);

    console.log(meta);

    return res.status(200).json({
      rows,
      meta,
    });
  } catch (error) {
    console.log(error);
  }
};
//obtenerProductos - paginado - total - populate

const obtenerProductos = async (req, res = response) => {
  const { currentPage = 1, pageSize = 5, filter, sorter, desc } = req.query;

  try {
    const count = await Producto.count({ where: { estado: true } });
    const { limit, offset } = calculateLimitAndOffset(currentPage, pageSize);

    let rows;
    if (filter) {
      rows = await Producto.findAll({
        attributes: ["id", "nSerie", "disponible"],
        include: [{ all: true, attributes: ["id", "nombre"] }],
        where: { estado: true },
        having: {
          [Op.or]: [
            { "Modelo.nombre": { [Op.like]: `%${filter}%` } },
            { "Bodega.nombre": { [Op.like]: `%${filter}%` } },
            { nSerie: { [Op.like]: `%${filter}%` } },
          ],
        },
      });
    } else {
      if (sorter) {
        let asc_desc = desc === "true" ? "DESC" : "ASC";
        let conOSinNombre = sorter == "nSerie" ? "nSerie" : `${sorter}.nombre`;

        rows = await Producto.findAll({
          attributes: ["id", "nSerie", "disponible"],
          include: [{ all: true, attributes: ["id", "nombre"] }],
          where: { estado: true },
          order: [[sequelize.col(conOSinNombre), asc_desc]],
          offset: offset,
          limit: limit,
        });
      } else {
        rows = await Producto.findAll({
          attributes: ["id", "nSerie", "disponible"],
          include: [{ all: true, attributes: ["id", "nombre"] }],
          where: { estado: true },
          order: [[sequelize.col("Modelo.nombre"), "ASC"]],
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
  // const { limite = 5, desde = 0 } = req.query;

  // const [total, productos] = await Promise.all([
  //   Producto.countDocuments({ estado: true }),

  // ]);

  // res.json({
  //   total,
  //   productos,
  // });
};
//obtenerProducto - populate  {}

const obtenerProducto = async (req, res = response) => {
  const { id } = req.params;

  const producto = await Producto.findByPk(id, {
    attributes: ["id", "nSerie", "disponible"],
    include: [{ all: true, attributes: ["id", "nombre"] }],
    where: { estado: true },
  });
  res.json({ producto });
};

const crearProducto = async (req, res = response) => {
  const { usuario, ...resto } = req.body;

  //generar data
  resto.usuario = req.usuario.dataValues.id;

  const data = {
    nSerie: resto.nSerie,
    ModeloId: resto.modelo,
    BodegaId: resto.bodega,
    UsuarioId: resto.usuario,
  };

  const productoDB = await Producto.findOrCreate({
    where: { nSerie: data.nSerie },
    defaults: {
      nSerie: data.nSerie.toUpperCase(),
      ModeloId: data.ModeloId,
      BodegaId: data.BodegaId,
      UsuarioId: data.UsuarioId,
    },
  }).then(([producto_, created]) => {
    if (!created) {
      return res.status(400).json({
        msg: "Ya existe un producto registrado con la serie",
      });
    } else {
      const forzarAsync = async () => {
        let producto = await Producto.findByPk(producto_.id, {
          attributes: ["id", "nSerie", "disponible"],
          include: [{ all: true, attributes: ["id", "nombre"] }],
          where: { estado: true },
        });

        let bodegaName = await Bodega.findByPk(data.BodegaId, {
          attributes: ["nombre"],
          raw: true,
        });

        //Metemos los datos a la tabla movimiento
        let movimiento = await Movimiento.create({
          local_nuevo: bodegaName.nombre,
          fecha: Date.now(),
          ProductoId: producto_.id,
        });

        res.status(201).json({
          msg: `Producto: ${producto.nSerie} agregado`,
          producto,
        });
      };
      forzarAsync();
    }
  });
};

//  zar categoria

const actualizarProducto = async (req, res = response) => {
  const { id } = req.params;
  const { estado, usuario, fecha_ingreso, ...resto } = req.body;

  if (Object.entries(resto).length === 0) {
    return res.status(500).json({ msg: "El objeto viene vacio" });
  }

  resto.usuario = req.usuario.dataValues.id;

  const data = {
    nSerie: resto.nSerie,
    ModeloId: resto.modelo,
    BodegaId: resto.bodega,
    UsuarioId: resto.usuario,
    cliente: resto.cliente,
  };

  //VALIDACION DE SERIE
  if (data.nSerie) {
    const existe = await Producto.findAll({
      where: { nSerie: data.nSerie, [Op.not]: [{ id }] },
    });

    if (existe.length > 0) {
      return res.status(400).json({
        msg: `La serie: ${data.nSerie} ya está registrada en la base de datos`,
      });
    }
  }

  try {
    const productoDB = await Producto.findByPk(id);
    const _productoDB = await Producto.findByPk(id, { raw: true });
    const originalName = await Bodega.findByPk(_productoDB.BodegaId, {
      attributes: ["nombre"],
      raw: true,
    });
    const nuevoName = await Bodega.findByPk(data.BodegaId, {
      attributes: ["nombre"],
      raw: true,
    });
    console.log("Producto db", _productoDB);

    await productoDB.update(data, {
      where: id,
    });

    const producto = await Producto.findByPk(id, {
      attributes: ["id", "nSerie", "disponible"],
      include: [{ all: true, attributes: ["id", "nombre"] }],
      where: { estado: true },
    });

    //Metemos los datos a la tabla movimiento
    let movimiento = await Movimiento.create({
      local_original: originalName.nombre,
      local_nuevo: nuevoName.nombre,
      fecha: Date.now(),
      ProductoId: id,
    });

    res.status(200).json({
      msg: `Producto: ${producto.nSerie}`,
      producto,
    });
  } catch (error) {
    console.log(error);
  }
};

//borrar categoria- estado:false

const borrarProducto = async (req, res = response) => {
  const { id } = req.params;
  const { estado, usuario, ...data } = req.body;

  data.usuario = req.usuario._id;
  data.estado = false;

  try {
    const productoDB = await Producto.findByPk(id);

    const producto = await productoDB.update(data, { where: id });
    res.status(200).json({
      producto,
      msg: `Producto N°: ${producto.nSerie} eliminado`,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  actualizarProducto,
  borrarProducto,
  crearProducto,
  obetenerInventario,
  obtenerProducto,
  obtenerProductos,
  cargaMasivaProducto,
  selectProducto,
};
