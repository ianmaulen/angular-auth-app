const { response } = require('express');
const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');

const crearUsuario = async(req, res = response) => {
  const { email, name, password } = req.body
  
  try {
    // verificar email
    const usuario = await Usuario.findOne({ email });

    if( usuario ) {
      return res.status(400).json({
        ok: false,
        msg: 'Ya existe usuario con ese email'
      });
    };

    // crear usuario con el modelo 
    const dbUsuario = new Usuario( req.body );

    // Hashear la constrasena
    const salt = bcrypt.genSaltSync(10);
    dbUsuario.password = bcrypt.hashSync(password, salt);
  
    // generar jsonWebtoken (JWT)
    const token = await generarJWT( dbUsuario.id, dbUsuario.name );

    // crear usuario de bd
    await dbUsuario.save();

    // Generar respuesta exitosa
    return res.status(200).json({
      ok: true,
      uid: dbUsuario.id,
      name,
      token,
    });

  } catch (err) {
    return res.status(500).json({
      ok: false,
      msg: 'por favor comunicarse con administrador'
    })
  }

  return res.json({
    ok: true,
    msg: 'Crear usuario /new '
  })
}

const loginUsuario  = async(req, res = response) => {
  const { email, password } = req.body

  try {

    const dbUsuario = await Usuario.findOne({ email });
    
    if (!dbUsuario) {
      return res.status(400).json({
        ok: false,
        msg: 'El correo no existe'
      })
    }

    const validPassword = bcrypt.compareSync( password, dbUsuario.password );
    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        msg: 'El password no es valido'
      })
    }

    const token = await generarJWT(dbUsuario.id, dbUsuario.name);

    return res.json({
      ok: true,
      uid: dbUsuario.id,
      name: dbUsuario.name,
      token,
    })

  } catch (err) {
    console.log(err)
    return res.status(500).json({
      ok: false,
      msg: 'por favor comunicarse con administrador'
    });
  }

}

const revalidarToken = async(req, res = response) => {

  const { uid, name } = req;

  const token = await generarJWT( uid, name );

  return res.json({
    ok: true,
    uid,
    name,
    token
  })
}

module.exports = {
  crearUsuario,
  loginUsuario,
  revalidarToken
}