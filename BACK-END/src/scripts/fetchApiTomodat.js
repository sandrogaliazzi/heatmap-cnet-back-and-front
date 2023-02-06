const fs = import("fs");

import needle from 'needle';
import fetch from 'node-fetch';
import fetTomodat from '../models/fetchModel.js';

const config = process.env
const path = import("path");
const fetchAllAcessPoints = [];
const tomodat = config.TOMODAT_KEY

const coord = {
  lat: "-29.582734100531393",
  lng: "-50.9251693190768",
  range: "200000"
}

const reqConfig = {
  headers: {
    "Authorization": `${tomodat}`,
    "Content-Type": "application/json",
    "Accept-encoding": "application/json",
    "Access-Control-Allow-Origin": '*',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,DELETE'
  }
}


async function getAllClients() {
  try {
    let response = await fetch(`https://sp.tomodat.com.br/tomodat/api/clients/`, reqConfig)
    let data = await response.json()
    return data
  } catch (err) {
    console.error("erro em getALLclients" + err)
  }
}

function getClientsByCto(users, id) {
  return users.filter(user => user.ap_id_connected == id).map(user => ({name:user.name, id: user.id}));
}


//pegar todos os pontos de acesso
async function getAllAcessPoints() {
  try {

    let response = await fetch(`https://sp.tomodat.com.br/tomodat/api/access_points/${coord.lat}/${coord.lng}/${coord.range}`, reqConfig)

    let data = await response.json()
    fetchAllAcessPoints.push(...data)
    return data

  } catch (err) {
    console.error("erro em getAllAP" + err.message);
  }
}


export async function getAllAcessPointsByCity() {
  try {

    let response = await fetch(`https://sp.tomodat.com.br/tomodat/api/access_points/list_path`, reqConfig)

    let data = await response.json()
    return data
  } catch (err) {
    console.error("erro em GetApByCity" + err.message);
  }
}

export function addClient(req, res) {
  let client = (req.body);
  needle.post(`https://sp.tomodat.com.br/tomodat/api/clients/auto_connect/`, client, reqConfig,
    ((err) => {
      if (err) {
        res.status(500).send({ message: `${err.message} - falha ao cadastrar user.` })
      } else {
        res.status(201).send({ ApiTomodatCadastroOk: `${client.date_time}: Cliente ${client.name} cadastrado com sucesso na cto ${client.cto_name} pelo usuario: ${client.user}.` });
      }
    }))
};

function getCtoCityById(aplist, id) {
  return aplist.filter(ap => ap.id === id).map(ap => ap.tree[ap.tree.length-1]);
}

export async function fetchTomodat() {
  try {
    let [aplist, apListWithCity, users] = await Promise.all(
    [getAllAcessPoints(), getAllAcessPointsByCity(), getAllClients()]
  );
    let ctoList = aplist ? aplist : fetchAllAcessPoints
    let ctoListFilter = ctoList.filter(ap => ap.category === 5);

   let usersByCto = ctoListFilter.map(cto => {

    return {
      id: cto.id,
      name: cto.name,
      coord: cto.dot,
      clients: getClientsByCto(users, cto.id),
      city: getCtoCityById(apListWithCity, cto.id)[0],
      percentage_free: cto.percentage_free
    }
  });

  return usersByCto;

} catch (err){
  console.log(err)
}}

// export function deleteTomodat(req, res){
//   let id = req.body.id;
//   console.log(id);
//   needle.delete(`https://sp.tomodat.com.br/tomodat/api/clients/`,id, reqConfig, ((err)=> {
//     if (err){
//     res.status(500).send(err)
//     } else {
//     res.status(204).send("true")
//     }
//   }))

// };


export function deleteTomodat(req, res) {
  let id = 15611 //req.body.id; 15611
  console.log(id);
  needle.delete(`https://sp.tomodat.com.br/tomodat/api/clients/`, id, reqConfig,
    ((err) => {
      if (err) {
        console.log(err)//res.status(500).send({ message: `${err.message} - falha ao deletar cliente.` })
      } else {
        console.log(res)//res.status(201).send({ ApiTomodatDeleteOk: `deletado com sucesso.` });
      }      
    }))
    };

    