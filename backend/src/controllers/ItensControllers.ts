import {Request, Response} from 'express';
import knex from '../database/connection';

class ItensControler {
    async index(request: Request, response: Response){
        const itens = await knex('itens').select('*');
        const sereliazedItens  = itens.map(item => {
            return {
                id: item.id,
                title: item.title,
                image_url: `http://192.168.0.13:3335/uploads/${item.image}`
            }
        })
        return response.json(sereliazedItens);
    }

};

export default ItensControler;