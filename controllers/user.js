const { response, request } = require("express");
const becrypter = require("bcryptjs");
const { Usuario } = require("../models/usuario");
const { Rol } = require("../models");
const { calculateLimitAndOffset, paginate } = require("paginate-info");
const { Op } = require("sequelize");
const sequelize = require("sequelize");



const usuariosGet = async (req = request, res = response) => {
  const { currentPage, pageSize, filter, sorter, desc } = req.query;

  try {
    
    const count = await Usuario.count()

    const {limit, offset} = calculateLimitAndOffset(currentPage,pageSize);

    let rows;

    if (filter) {
      //Filtro
      rows= await Usuario.findAll({
        include: [{ model: Rol, attributes: ["nombre"] }],
        where: {
          [Op.or]: [
            { correo: { [Op.like]: `%${filter}%` } },
            { nombre: { [Op.like]: `%${filter}%` } }
          ]
        }
      
      })
      
    } else {
      if (sorter) {
        let asc_desc = desc === "true" ? "DESC" : "ASC";

        rows = await Usuario.findAll({
          include: [{ model: Rol, attributes: ["nombre"] }],
          order: [ [sequelize.col(`${sorter}`), asc_desc],[sequelize.col(`estado`), "DESC"],[sequelize.col(`RolId`), "ASC"]],
          offset:offset,
          limit:limit
        })
      } else {
        rows = await Usuario.findAll({
          include: [{ model: Rol, attributes: ["nombre"] }],
          order: [[sequelize.col(`estado`), "DESC"],[sequelize.col(`RolId`), "ASC"]],
          offset:offset,
          limit:limit
        })
        
      }
    }

    const meta = paginate(currentPage,count,rows,pageSize)

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

const inicial = async (req, res) => {
  const { nombre, correo, password, rol } = req.body;
  let role;

  switch (rol) {
    case "ADMIN_ROLE":
      role = 1;

      break;
    case "BODEGA_ROLE":
      role = 2;

      break;
    case "SERVICIO_ROLE":
      role = 3;

      break;
    case "USER_ROLE":
      role = 4;

      break;
  }

  const data = {
    nombre,
    correo,
    password,
    RolId: role,
  };
  // Encriptar contraseña
  const salt = becrypter.genSaltSync();
  data.password = becrypter.hashSync(password, salt);
  //Guardar DB
  const usuario = new Usuario(data);
  await usuario.save();

  let respuesta = await Usuario.findByPk(usuario.id,{
    include: [{ model: Rol }],
    order: [[sequelize.col("id"), "DESC"]],
  })


  res.status(201).json({
    msg: `Usuario: ${nombre} creado con exito`,
    respuesta,
  });
};
const usuariosPost = async (req, res) => {
  const { nombre, correo, password, rol } = req.body;
  let role;

  switch (rol) {
    case "ADMIN_ROLE":
      role = 1;

      break;
    case "BODEGA_ROLE":
      role = 2;

      break;
    case "SERVICIO_ROLE":
      role = 3;

      break;
    case "USER_ROLE":
      role = 4;

      break;
  }

  const data = {
    nombre,
    correo,
    password,
    RolId: role,
  };
  // Encriptar contraseña
  const salt = becrypter.genSaltSync();
  data.password = becrypter.hashSync(password, salt);
  //Guardar DB
  const usuario = new Usuario(data);
  await usuario.save();

  let respuesta = await Usuario.findByPk(usuario.id,{
    include: [{ model: Rol }],
    order: [[sequelize.col("id"), "DESC"]],
  })


  res.status(201).json({
    msg: `Usuario: ${nombre} creado con exito`,
    respuesta,
  });
};

const usuariosPut = async (req, res) => {
  const { id } = req.params;
  const { _id, password, rol, correo, ...resto } = req.body;
  let role;

  if (password) {
    const salt = becrypter.genSaltSync();
    resto.password = becrypter.hashSync(password, salt);
  }

  if (rol) {
    switch (rol) {
      case "ADMIN_ROLE":
        role = 1;
        resto.RolId = role
  
        break;
      case "BODEGA_ROLE":
        role = 2;
        resto.RolId = role

  
        break;
      case "SERVICIO_ROLE":
        role = 3;
        resto.RolId = role

  
        break;
      case "USER_ROLE":
        role = 4;
        resto.RolId = role 
        break;
    }
    
  }

  try {
    
    const usuario= await Usuario.findByPk(id)
    const userUpdate= await usuario.update(resto,{where:id})
    res.status(200).json({
      msg:`Usuario id: ${usuario.id} ha sido actualizado`,
      userUpdate,
    });
  } catch (error) {
    res.status(500).json({
      error,
      msg:"Error"
    });
  }
    

};


const usuariosDelete = async (req, res) => {
  const { id } = req.params;

  const usuario_autenticado = req.usuario;

  //Fisicamente lo borramos
  // const usuario = await Usuario.findOneAndDelete(id);

  //Actualmente no es recomendado eliminar los registros, ahora se le cambia el estado

  const usuarioDb= await Usuario.findByPk(id)
  const estado= await Usuario.findByPk(id,{attributes:['estado'], raw:true})

  console.log(estado.estado);
  
  let toggle = parseInt(estado.estado) == 1 ? true : false

  console.log(toggle);

  const usuario = await usuarioDb.update(
    {estado:!toggle},{where:{id}}
  )

  res.json({
    usuario_autenticado,
    usuario,
  });
};
module.exports = {
  usuariosGet,
  usuariosPost,
  usuariosPut,
  usuariosDelete,
  inicial
};
