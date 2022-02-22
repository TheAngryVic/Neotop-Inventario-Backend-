const { response } = require("express");
const { calculateLimitAndOffset, paginate } = require("paginate-info");
const { Tecnico, Producto, Modelo } = require("../models");
const { Op } = require("sequelize");
const sequelize = require("sequelize");
const res = require("express/lib/response");

const obtenerTecnicos = async (req, res = response) => {
  const { currentPage = 1, pageSize = 5, filter, sorter, desc } = req.query;

  try {
    const count = await Tecnico.count();

    const { limit, offset } = calculateLimitAndOffset(currentPage, pageSize);

    let rows;
    if (filter) {
      rows = await Tecnico.findAll({
        attributes: [
            "id",
            "cliente",
            "fecha_entrada",
            [
              sequelize.fn(
                "DATE_FORMAT",
                sequelize.col("fecha_entrada"),
                "%d-%m-%Y"
              ),
              "fecha_entrada",
            ],

            "diagnostico_entrada",
            "diagnostico_salida",
            "tecnico",
            "fecha_salida",
            [
              sequelize.fn(
                "DATE_FORMAT",
                sequelize.col("fecha_salida"),
                "%d-%m-%Y"
              ),
              "fecha_salida",
            ],
          ],
        include: [
          {
            model: Producto,
            required: true,
            attributes: ["nSerie"],
            include: [
              {
                model: Modelo,
                required: true,
                attributes: ["nombre"],
              },
            ],
          },
        ],
        having: {
          [Op.or]: [
            { "Producto.nSerie": { [Op.like]: `%${filter}%` } },
            { cliente: { [Op.like]: `%${filter}%` } },
          ],
        },
        // having: { "Producto.nSerie": { [Op.like]: `%${filter}%` } },
      });
    } else {
      if (sorter) {
        let asc_desc = desc === "true" ? "DESC" : "ASC";
        rows = await Tecnico.findAll({
            attributes: [
                "id",
                "cliente",
                "fecha_entrada",
                [
                  sequelize.fn(
                    "DATE_FORMAT",
                    sequelize.col("fecha_entrada"),
                    "%d-%m-%Y"
                  ),
                  "fecha_entrada",
                ],
    
                "diagnostico_entrada",
                "diagnostico_salida",
                "tecnico",
                "fecha_salida",
                [
                  sequelize.fn(
                    "DATE_FORMAT",
                    sequelize.col("fecha_salida"),
                    "%d-%m-%Y"
                  ),
                  "fecha_salida",
                ],
              ],
          include: [
            {
              model: Producto,
              required: true,
              attributes: ["nSerie"],
              include: [
                {
                  model: Modelo,
                  required: true,
                  attributes: ["nombre"],
                },
              ],
            },
          ],
          order: [[sequelize.col(sorter), asc_desc]],
          offset: offset,
          limit: limit,
        });
      } else {
        rows = await Tecnico.findAll({
          attributes: [
            "id",
            "cliente",
            "fecha_entrada",
            [
              sequelize.fn(
                "DATE_FORMAT",
                sequelize.col("fecha_entrada"),
                "%d-%m-%Y"
              ),
              "fecha_entrada",
            ],

            "diagnostico_entrada",
            "diagnostico_salida",
            "tecnico",
            "fecha_salida",
            [
              sequelize.fn(
                "DATE_FORMAT",
                sequelize.col("fecha_salida"),
                "%d-%m-%Y"
              ),
              "fecha_salida",
            ],
          ],
          include: [
            {
              model: Producto,
              required: true,
              attributes: ["nSerie"],
              include: [
                {
                  model: Modelo,
                  required: true,
                  attributes: ["nombre"],
                },
              ],
            },
          ],
          order: [["fecha_entrada", "desc"]],
          offset: offset,
          limit: limit,
        });
      }
    }

    const meta = paginate(currentPage, count, rows, pageSize);

    return res.status(200).json({ rows, meta });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error, msg: "fatañ error" });
  }
};

const agregarTecnico = async (req, res = response) => {
  const { cliente, tecnico, ...data } = req.body;

  let upperCliente = cliente;
  let upperTecnico = tecnico;

  data.cliente = upperCliente.toUpperCase();
  data.tecnico = upperTecnico.toUpperCase();

  try {
    await Tecnico.create(data)
      .then((r) => {
        const forzarAsync = async () => {
          let raw = await Tecnico.findByPk(r.id, {
            attributes: [
              "id",
              "cliente",
              "fecha_entrada",
              "diagnostico_entrada",
              "diagnostico_salida",
              "tecnico",
              "fecha_salida",
            ],
            include: [
              {
                model: Producto,
                required: true,
                attributes: ["nSerie"],
                include: [
                  {
                    model: Modelo,
                    required: true,
                    attributes: ["nombre"],
                  },
                ],
              },
            ],
          });

          res.status(201).json({
            msg: "Se ha agregado con exito",
            raw,
          });
        };
        forzarAsync();
      })
      .catch((f) => {
        console.log(f);
      });
  } catch (error) {
    console.log(error);
  }
};

const modificarTecnico = async (req, res = response) => {
  const { id } = req.params;
  const { cliente, tecnico, ...data } = req.body;

  if (Object.entries(data).length === 0) {
    return res.status(500).json({ msg: "El objeto viene vacio" });
  }
  let a;
  //ToUpperCase() en caso de que venga cliente y tecnico
  cliente ? (data.cliente = cliente.toUpperCase()) : (a = 1);
  tecnico ? (data.tecnico = tecnico.toUpperCase()) : (a = 1);

  try {
    const tecnicoDB = await Tecnico.findByPk(id);
    const tecnico_update = await tecnicoDB.update(
      {
        cliente: data.cliente,
        diagnostico_entrada: data.diagnostico_entrada,
        tecnico: data.tecnico,
        ProductoId: data.ProductoId,
      },
      { where: id }
    );
    res.status(200).json({
      msg: "actualizado",
      tecnico_update,
    });
  } catch (error) {
    console.log(error);
  }
};

const terminarTecnico = async (req, res = response) => {
  const { id } = req.params;
  const { diagnostico_salida, ...data } = req.body;

  // if (Object.entries(data).length === 0) {
  //     return res.status(500).json({ msg: "El objeto viene vacio" });
  // }

  try {
    const tecnicoDB = await Tecnico.findByPk(id);
    const tecnico_terminado = await tecnicoDB.update(
      {
        diagnostico_salida: diagnostico_salida,
        fecha_salida: sequelize.NOW(),
      },
      { where: id }
    );
    let tecnico = await Tecnico.findByPk(id, {
      attributes: [
        "id",
        "cliente",
        "fecha_entrada",
        "diagnostico_entrada",
        "diagnostico_salida",
        "tecnico",
        "fecha_salida",
      ],
      include: [
        {
          model: Producto,
          required: true,
          attributes: ["nSerie"],
          include: [
            {
              model: Modelo,
              required: true,
              attributes: ["nombre"],
            },
          ],
        },
      ],
    });
    res.status(200).json({
      msg: "actualizado",
      tecnico,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  obtenerTecnicos,
  modificarTecnico,
  agregarTecnico,
  terminarTecnico,
};
