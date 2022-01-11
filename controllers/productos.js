const { response } = require("express");
const { Categoria, Producto, Modelo } = require("../models");

const ObjectId = require("mongodb").ObjectId;

const { calculateLimitAndOffset, paginate } = require("paginate-info");

//obtenerProductos - paginado - total - populate

const obtenerProductos = async (req, res = response) => {
  const { currentPage, pageSize, ad = "1" } = req.query;

  try {
    const count = await Producto.countDocuments({ estado: true });
    const { limit, offset } = calculateLimitAndOffset(currentPage, pageSize);

    const rows = await Producto.aggregate([
      {$addFields:{ "modelo_id":{$toString: '$_id'}}},
      {
        $lookup:
        {
           from: 'Modelo',
           localField: "modelo_id",
           foreignField: "_id" ,
           as: "modelo_info"
       }
      },
      // {$group:{
      //   _id:"$modelo",
      //   total:{$sum:1},
      //   modelos:{$push:'$modelo'}
      // }},
      // { $project: { modelos:1 , total: 1, _id: 0,  } },
    ])
      // .skip(offset)
      // .limit(limit);

      
      const populateQuery = {
            path: 'modelos',
      };

     await Producto.populate(rows,populateQuery,(e,r)=>{
      if (e) {
        console.log(e);
      } else {
        console.log(rows);
      }
    })

    // console.log(populatedRow);



    // await rows.populate('modelo',"nombre").execPopulate()
   

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

  const producto = await Producto.findById(id)
    .populate("usuario", "nombre")
    .populate("modelo", "nombre")
    .populate("bodega", "nombre");

  res.json({ producto });
};

const crearProducto = async (req, res = response) => {
  const { usuario, ...data } = req.body;

  //generar data

  data.usuario = req.usuario._id;

  const producto = new Producto(data);

  // Guardar en la base de datos
  await producto.save();

  await producto.populate("modelo", "nombre");
  await producto.populate("bodega", "nombre");
  await producto.populate("usuario", "nombre");

  res.status(201).json(producto);
};

//actualizar categoria

const actualizarProducto = async (req, res = response) => {
  const { id } = req.params;
  const { estado, usuario, fecha_ingreso, ...data } = req.body;

  if (Object.entries(data).length === 0) {
    return res.status(500).json({ msg: "El objeto viene vacio" });
  }

  data.usuario = req.usuario._id;

  data.modelo = ObjectId(data.modelo);

  console.log(data);

  const producto = await Producto.findByIdAndUpdate(id, data, { new: true });

  res.status(200).json({
    producto,
  });
};

//borrar categoria- estado:false

const borrarProducto = async (req, res = response) => {
  const { id } = req.params;
  const { estado, usuario, ...data } = req.body;

  data.usuario = req.usuario._id;
  data.estado = false;

  const producto = await Producto.findByIdAndUpdate(id, data, { new: true })
    .populate("usuario", "nombre")
    .populate("modelo", "nombre")
    .populate("bodega", "nombre");

  res.status(200).json({
    producto,
    msg: `Producto ${producto.modelo.nombre} N°: ${producto.nSerie} eliminado`,
  });
};

module.exports = {
  actualizarProducto,
  borrarProducto,
  crearProducto,
  obtenerProducto,
  obtenerProductos,
};
