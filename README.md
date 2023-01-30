# heatmap cnet back and front

 APP TÉCNICO PARA PROVEDOR.

Aplicativo Técnico para provedores de internet, aplicativo ainda em desenvolvimento, sendo feito com as técnilogias: JS, ReactJs, NodeJS, ExpressJS, MongoDB.
O aplicativo usa API do maps para gerar o mapa e uma API no back para comuncar com a API de outro sistema de gerencia de rede optica (TOMODAT).

<div align="center">

<img src="./readme.images/login.jpg" width="800px" />

1. Tela de login feita com bootstrap, login com JWTauth no back.

</div>

<div align="center">

<img src="./readme.images/tela de entrada.jpg" width="800px" />

2. Tela de recepção do app, logo após autenticar o login, no topo vemos a barra superior com as funcionalidades, campo de pesquisa e botão de logout.
Na tela abre o mapa com o heatmap ativo, cada ponto do heatmap é uma CTO (Caixa de Atendimento Optico) em um raio de 200mt, facilitando a questão de vendas para provedores de internet, Ao iniciar a tela centraliza na cidade em que o provedor tem matriz (podendo ser alterado no cod as cidades que quer centralizar, criar um botão pra centralizar em cada cidade) 

</div>

<div align="center">

<img src="./readme.images/pesquisa clientes.jpg" width="800px" />

3. Tela da funcionalidade clientes, ao clicar nela abre uma barra lateral com dois campos de pesquisa, no primeiro campo como podemos ver, é o campo de pesquisa de cliente, ao digitar o nome no campo, ira retornar os clientes correspondetes, ao lado do nome tem dois botões, cto e cliente, uma para a localização da caixa de atendimento do cliente e outra para a localização do cliente caso já tenha cadastrada, se não tiver cadastrada da para cadastrar uma nova, ou tambem atualizar. 
</div>


<div align="center">

<img src="./readme.images/cliente loc ja no sys.jpg" width="800px" />
<img src="./readme.images/cliente sem loc.jpg" width="800px" />

4. Tela da funcionalidade clientes, ao clicar no botão clientes abre um modal com botões para atualizar a localização do cliente, abrir no maps a localização do cleinte e um mini-mapa com a localização do cliente na tela, caso não tenha cadastrada a localização do cliente abre um modal com um botão para adicionar a localização do cliente.
</div>