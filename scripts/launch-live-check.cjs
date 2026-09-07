const fs=require('node:fs'); const crypto=require('node:crypto');
const base=process.argv[2]||'https://www.guidesimmoquebec.com';
async function main(){
 const result=[];
 for(const route of ['/','/catalogue','/panier','/connexion','/inscription','/abonnement','/compte','/admin','/api/auth/session','/api/download?slug=acheter-un-chalet-residence-secondaire','/storage/pdf/50_acheter-un-chalet-residence-secondaire.pdf']){
  const r=await fetch(base+route,{redirect:'manual',signal:AbortSignal.timeout(20000)});
  result.push({route,status:r.status,location:r.headers.get('location')});
  if(r.status>=500) throw Error(JSON.stringify(result.at(-1)));
  if(['/compte','/admin'].includes(route)&&![302,303,307,308].includes(r.status)) throw Error('Protected page accessible: '+route);
  if(route.startsWith('/storage/')&&r.status!==404) throw Error('Private storage exposed');
  if(route.startsWith('/api/download')&&r.headers.get('content-type')?.includes('application/pdf')) throw Error('Unauthenticated PDF accessible');
  if(route==='/api/auth/session') {
   const session=await r.json();
   if(r.status!==200 || (session!==null && Object.keys(session).length!==0)) throw Error('Unexpected anonymous session');
  }
 }
 const img=await fetch(base+'/covers/50.jpg'); const remote=Buffer.from(await img.arrayBuffer());
 const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
 if(hash(remote)!==hash(fs.readFileSync('public/covers/50.jpg'))) throw Error('French chalet cover not yet deployed');
 const home=await fetch(base+'/');
 if(home.headers.get('x-content-type-options')!=='nosniff') throw Error('Security headers missing');
 fs.mkdirSync('../launch-qa',{recursive:true}); fs.writeFileSync('../launch-qa/live-report.json',JSON.stringify(result,null,2));
 console.log('PASS production: public pages, anonymous admin/account protection, private PDF protection, French cover hash, security headers.');
}
main().catch(error=>{console.error(error);process.exitCode=1;});
