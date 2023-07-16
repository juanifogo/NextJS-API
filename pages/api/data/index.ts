import type { NextApiRequest, NextApiResponse } from 'next'
import {prisma} from '@/db'

const chkUndef = (element: any) => typeof(element) === 'undefined'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch(req.method){
    case 'GET':
      try{
        const result = await prisma.transporte.findMany()
        let output = "GET a /api/data"
        console.log(output)
        return res.status(200).send(result)
      }
      catch(err){
        res.status(500).send({mensaje: "Error del servidor"})
        throw err
      }
    case 'POST':
      const {temperatura, humedad, "x-pos":x_pos, "y-pos":y_pos, tag} = req.body
      if([humedad, temperatura, x_pos, y_pos, tag].some(chkUndef)){
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
        if (result){
          let output = 'Ya existe una columna con el tag correspondiente'
          console.log(output)
          return res.status(400).send({mensaje: output})
        }
      }
      catch(err){
        res.status(500).send({mensaje: "Error del servidor"})
        throw err
      }
      try{
        const result = await prisma.transporte.create({
          data: {
            humedad: humedad,
            temperatura: temperatura,
            x_pos: x_pos,
            y_pos: y_pos,
            tag: tag
          },
        })
        let output = `Recurso creado con ID: ${result.id}, tag: ${tag}`
        console.log(output)
        return res.status(200).send({mensaje: output})
      }
      catch(err){
        res.status(500).send({mensaje: "Error del servidor"})
        throw err
      }
  default:
    return res.status(405).json({mensaje: "Solo se permite GET y POST a esta ruta"})
  }
}