const { response } = require("express");
const { Bodega } = require("../models");
//pagination
const { calculateLimitAndOffset, paginate } = require("paginate-info");


const obtenerBodegas = async (req, res = response) => {

  const  {currentPage, pageSize,  ad = '1'} = req.query;


  try {

    const count = await Bodega.countDocuments({ estado: true });

    const {limit, offset} = calculateLimitAndOffset(currentPage, pageSize);

    const rows = await Bodega.find({estado:true})
    .sort({nombre: ad})
    .skip(offset)
    .limit(limit);
    
    const meta = paginate(currentPage, count, rows, pageSize);

    return res.status(200).json({
      rows,
      meta
    })
    
  } catch (error) {

    console.log(error);
    
    return res.status(500).json({
       error

    })
  }

};
// const obtenerBodegas = async (req, res = response) => {
//   const { limite = 5, page= req.query.page > 0 ? req.query.page  : 0  } = req.query;

//   const [total, bodegas] = await Promise.all([
//     Bodega.countDocuments({ estado: true }),
//     Bodega.find({ estado: true }).limit(Number(limite)).skip(Number(limite * page)),
//   ]);

//   res.json({
//     total,
//     bodegas,
//   });
// };

const obtenerBodega = async (req, res = response) => {
  const { id } = req.params;

  const bodega = await Bodega.findById(id);
  res.json({ bodega });
};

const crearBodega = async (req, res = response) => {
  const nombre = req.body.nombre.toUpperCase();
  const local = req.body.local.toUpperCase();

  const bodegaDB = await Bodega.findOne({ nombre });

  if (bodegaDB) {
    return res.status(400).json({ msg: "La bodega ya existe" });
  }
  //Generar data
  const data = {
    nombre,
    local,
  };
  const bodega = new Bodega(data);
  await bodega.save();
  res.status(201).json(bodega);
};

const actualizarBodega = async (req, res = response) => {
  const { id } = req.params;
  const { estado, ...data } = req.body;

  if (Object.entries(data).length === 0) {
    return res.status(500).json({ msg: "El objeto viene vacio" });
  }

  if (data.nombre) {
    const existe = await Bodega.findOne({ nombre: data.nombre.toUpperCase() });

    if (existe) {
      return res
        .status(400)
        .json({ msg: `${data.nombre} ya existe en la base de datos` });
    }
    data.nombre = data.nombre.toUpperCase();
  }

  if (data.local) {
    data.local = data.local.toUpperCase();
  }

  const bodega = await Bodega.findByIdAndUpdate(id, data, { new: true });

  res.status(200).json({
    msg:`Bodega ${data.uid} actualizada`
    ,bodega
  });
};

const borrarBodega = async (req, res = response) => {
  const { id } = req.params;
  const { estado, usuario, ...data } = req.body;

  data.estado = false;

  const bodega = await Bodega.findByIdAndUpdate(id, data, { new: true });

  res.status(200).json({
    bodega,
    msg: `bodega ${bodega.nombre} eliminado`,
  });
};

module.exports = {
  actualizarBodega,
  borrarBodega,
  crearBodega,
  obtenerBodegas,
  obtenerBodega,
};
