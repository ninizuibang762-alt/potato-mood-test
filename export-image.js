function reportRound(ctx,x,y,w,h,r,fill,stroke='#74492d',line=4){ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath();ctx.fillStyle=fill;ctx.fill();if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=line;ctx.stroke()}}
function reportLines(ctx,text,x,y,maxWidth,lineHeight,maxLines=99){let row='',rows=[];for(const ch of text){const test=row+ch;if(ctx.measureText(test).width>maxWidth&&row){rows.push(row);row=ch}else row=test}if(row)rows.push(row);rows.slice(0,maxLines).forEach((s,i)=>ctx.fillText(s,x,y+i*lineHeight))}
function reportPotato(type){return new Promise((resolve,reject)=>{const blob=new Blob([potatoSVG(type)],{type:'image/svg+xml;charset=utf-8'}),url=URL.createObjectURL(blob),img=new Image();img.onload=()=>{URL.revokeObjectURL(url);resolve(img)};img.onerror=()=>{URL.revokeObjectURL(url);reject(new Error('image'))};img.src=url})}
async function makePotatoReport(){
  const shown=document.querySelector('#resultName').textContent;
  const key=Object.keys(results).find(k=>results[k].name===shown)||localStorage.getItem('potato-last')||'lie';
  const r=results[key],canvas=document.createElement('canvas'),ctx=canvas.getContext('2d');canvas.width=1080;canvas.height=1680;
  ctx.fillStyle='#fff5dc';ctx.fillRect(0,0,1080,1680);ctx.fillStyle='rgba(239,179,105,.24)';for(let y=18;y<1680;y+=34)for(let x=18;x<1080;x+=34){ctx.beginPath();ctx.arc(x,y,2.2,0,Math.PI*2);ctx.fill()}
  reportRound(ctx,65,55,950,1570,42,'#fffdf7','#74492d',7);ctx.setLineDash([12,10]);reportRound(ctx,84,74,912,1532,32,'rgba(0,0,0,0)','rgba(116,73,45,.24)',3);ctx.setLineDash([]);
  ctx.textAlign='center';ctx.fillStyle='#b36037';ctx.font='900 34px "PingFang SC","Microsoft YaHei",sans-serif';ctx.fillText('土豆鉴定完成！',540,135);
  const img=await reportPotato(key);ctx.drawImage(img,350,160,380,340);
  ctx.fillStyle='#80634e';ctx.font='800 27px "PingFang SC","Microsoft YaHei",sans-serif';ctx.fillText('你是：',540,525);ctx.fillStyle='#513621';ctx.font='900 66px "PingFang SC","Microsoft YaHei",sans-serif';ctx.fillText(r.name,540,600);
  reportRound(ctx,280,625,520,58,28,'#fff0b9','#74492d',4);ctx.fillStyle='#513621';ctx.font='800 25px "PingFang SC","Microsoft YaHei",sans-serif';ctx.fillText('精神状态评级：'+r.rating,540,663);
  ctx.textAlign='left';ctx.fillStyle='#634a37';ctx.font='600 27px "PingFang SC","Microsoft YaHei",sans-serif';reportLines(ctx,r.desc,135,735,810,44,5);
  reportRound(ctx,115,942,850,120,22,'#fff7db','#9d7656',4);ctx.fillStyle='#a85a34';ctx.font='800 23px "PingFang SC","Microsoft YaHei",sans-serif';ctx.fillText('今日建议',145,980);ctx.fillStyle='#513621';ctx.font='700 26px "PingFang SC","Microsoft YaHei",sans-serif';reportLines(ctx,r.advice,145,1024,790,36,2);
  reportRound(ctx,115,1085,850,120,22,'#ffe1d7','#9d7656',4);ctx.fillStyle='#a85a34';ctx.font='800 23px "PingFang SC","Microsoft YaHei",sans-serif';ctx.fillText('人生格言',145,1123);ctx.fillStyle='#513621';ctx.font='700 27px "PingFang SC","Microsoft YaHei",sans-serif';reportLines(ctx,r.quote,145,1167,790,36,2);
  reportRound(ctx,115,1228,850,245,22,'#f8f1df','#74492d',4);ctx.fillStyle='#513621';ctx.font='900 27px "PingFang SC","Microsoft YaHei",sans-serif';ctx.fillText('土豆出厂检验单',145,1270);ctx.font='650 22px "PingFang SC","Microsoft YaHei",sans-serif';ctx.fillStyle='#634a37';[`编号：${r.id}　　品种：${r.name}`,`危险等级：${r.danger}`,`日常行为：${r.behavior}`,`适合环境：${r.env}`,`禁止事项：${r.ban}`].forEach((s,i)=>ctx.fillText(s,145,1315+i*35));
  ctx.textAlign='center';ctx.fillStyle='#513621';ctx.font='900 24px "PingFang SC","Microsoft YaHei",sans-serif';ctx.fillText('经检测：此土豆精神状态十分美丽，允许继续在人间滚动。',540,1535);ctx.fillStyle='#a57b59';ctx.font='600 19px "PingFang SC","Microsoft YaHei",sans-serif';ctx.fillText('测测你是哪种精神状态的土豆',540,1580);return {canvas,r}
}
async function savePotatoReport(){
  const btn=document.querySelector('#saveBtn'),old=btn.textContent;btn.disabled=true;btn.textContent='正在制作图片…';
  try{const {canvas,r}=await makePotatoReport(),blob=await new Promise(ok=>canvas.toBlob(ok,'image/png',1));if(!blob)throw new Error('blob');const name=`我的土豆报告-${r.name}.png`,file=new File([blob],name,{type:'image/png'});
    if(navigator.share&&navigator.canShare&&navigator.canShare({files:[file]})){await navigator.share({files:[file],title:'我的土豆报告'});toast('图片已生成，可选择保存到相册')}
    else{const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),5000);toast('土豆报告图片已下载！')}
  }catch(e){if(e.name!=='AbortError')toast('生成失败啦，请先截图保存');}finally{btn.disabled=false;btn.textContent=old}
}
document.querySelector('#saveBtn').onclick=savePotatoReport;
