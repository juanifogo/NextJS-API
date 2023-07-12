import type { NextApiRequest, NextApiResponse } from 'next'
import {prisma} from '@/db'

const chkUndef = (element: any) => typeof(element) === 'undefined'

export default async function handler(
  req: NextApiRequest, 
  res: NextApiResponse
) {
  if(req.method === 'POST'){
    const tag = String(req.query.tag)
    const {humedad, temperatura, "x-pos":x_pos, "y-pos":y_pos} = req.body
    let id: number

    if([humedad, temperatura, x_pos, y_pos].some(chkUndef)){
      let output = 'No puede haber campos vacios'
      console.log(output)
      return res.status(400).send({mensaje: output})
    }

    try{
      const result = await prisma.transporte.findFirst({
        where: {
          tag: tag
        }
      })
      if(!result){
        let output = "No se encontro una columna con el tag correspondiente"
        console.log(output)
        return res.status(404).send({mensaje: output})
      }
      else{
        id = result.id
      }
    }
    catch(err){
      res.status(500).send({mensaje: "Error del servidor"})
      throw err
    }
    try{
      const result = await prisma.transporte.updateMany({
        where: {
          tag: tag
        },
        data: {
          humedad: humedad,
          temperatura: temperatura,
          x_pos: x_pos,
          y_pos: y_pos
        }
      })
      let output = `Humedad: ${humedad}%, temperatura: ${temperatura}°C, X:${x_pos} Y: ${y_pos}, ID: ${id}`
      console.log(output)
      return res.status(200).send({mensaje: output})
    }
    catch(err){
      res.status(500).send({mensaje: "Error del servidor"})
      throw err
    }
  }
  else{
    return res.status(405).json({mensaje: "Solo se permite POST a esta ruta"})
  }  
}