const { response } = require("express");
const { Usuario } = require("../models/usuario");
const bcrypter = require("bcryptjs");
const { generarJWT } = require("../helpers/generarToken");
const { Movimiento, Producto } = require("../models");
const { calculateLimitAndOffset, paginate } = require("paginate-info");
const { Op } = require("sequelize");
const sequelize = require("sequelize");




const obtenerMovimientos = async (req, res = response) => {
    const { currentPage = 1, pageSize = 5, filter, sorter, desc } = req.query;
  
    try {
      const count = await Movimiento.count({
      });
  
      const { limit, offset } = calculateLimitAndOffset(currentPage, pageSize);
  
      let rows;
  
      if (filter) {
   
        rows = await Movimiento.findAll({
            attributes: ["Producto.nSerie", "local_original", "local_nuevo","fecha"],
            include: [{ model: Producto, attributes: ["nSerie"] }],
            having: { "Producto.nSerie": { [Op.like]: `%${filter}%` } },
        });
      } else {
        if (sorter) {
          let asc_desc = desc === "true" ? "DESC" : "ASC";
  
          rows = await Movimiento.findAll({
            attributes: ["Producto.nSerie", "local_original", "local_nuevo","fecha"],
            include: [{ model: Producto, attributes: ["nSerie"] }],
            order: [[sequelize.col(sorter), asc_desc]],
            offset: offset,
            limit: limit,
          });
        } else {
          rows = await Movimiento.findAll({
            attributes: ["Producto.nSerie", "local_original", "local_nuevo","fecha"],
            include: [{ model: Producto, attributes: ["nSerie"] }],
            order: [["fecha", "asc"]],
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

module.exports = { obtenerMovimientos };
