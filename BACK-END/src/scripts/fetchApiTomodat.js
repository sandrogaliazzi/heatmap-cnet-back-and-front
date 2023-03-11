const fs = import("fs");
import dotenv from 'dotenv';
dotenv.config()
import needle from 'needle';
import fetch from 'node-fetch';

const path = import("path");
const fetchAllAcessPoints = [];

const coord = {
  lat: "-29.582734100531393",
  lng: "-50.9251693190768",
  range: "200000"
}

const reqConfig = {
  headers: {
    "Authorization": "6f1abca83548d1d58a92e6562ed7e118358cc7ba",
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
// export function deleteTomodat(req, res) {
//   let id = req.params.id;
//   console.log(typeof id)
//    needle.delete(`https://sp.tomodat.com.br/tomodat/api/clients/${id}`, reqConfig,
//     ((err) => {
//       if (err) {
//         console.log(err)//res.status(500).send({ message: `${err.message} - falha ao deletar cliente.` })
//       } else {
//         res.status(201).send({ ApiTomodatDeleteOk: `deletado com sucesso ${id}` });
//       }      
//     }))
//     };

// for debug purposes     
// console.log(reqConfig)
// fetchTomodat().then(data =>{
//   console.log(data)
// });

// export async function deleteTomodat(req, res) {
//   let id = req.body.id
//   console.log(id)
//   try {
//       const response = await fetch(`https://sp.tomodat.com.br/tomodat/api/clients/${id}`, reqConfig)
      
//       return response;
//   } catch(err){
//       console.error("erro"+err)
// }
// }
