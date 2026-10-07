import http from 'node:http';
const role=process.env.ROLE || 'worker';
const port=Number(process.env.PORT || 3000);
const products=[{id:'11111111-1111-4111-8111-111111111111',sku:'DEMO-001',name:'Produto sintetico',price:99.90}];
const server=http.createServer((req,res)=>{
 const url=new URL(req.url,'http://localhost');
 let status=200, body;
 if(url.pathname==='/health'){body={status:'ok',role,mode:'architecture-demo'};}
 else if(role==='catalog' && url.pathname==='/catalog'){body={products,source:'synthetic',cacheImplemented:false};}
 else if(role==='checkout' && url.pathname==='/checkout'){status=501;body={error:'Checkout transacional e pagamento nao implementados no esqueleto',reference:'docs/arquitetura/03-checkout-e-eventos.md'};}
 else if(role==='web' && url.pathname==='/'){body={message:'Demo de arquitetura Santa Cecilia',catalog:'/catalog',checkout:'/checkout'};}
 else{status=404;body={error:'not_found',role};}
 res.writeHead(status,{'Content-Type':'application/json; charset=utf-8'}); res.end(JSON.stringify(body));
});
server.listen(port,process.env.BIND_HOST || '127.0.0.1');
process.on('SIGTERM',()=>server.close());
process.on('SIGINT',()=>server.close());
